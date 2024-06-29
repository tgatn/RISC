import React from 'react';
import { Box, Button, Card, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './styles/SupplyChainRoutes.css'
import { Autocomplete, GoogleMap, LoadScript } from '@react-google-maps/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';




import LocationService from '../services/LocationService';
import Location from '../models/Location';
import LocationType from '../models/LocationType';
import Disruption from '../models/Disruption';
import { idText } from 'typescript';


function Locations() {


  const API_KEY: string = String(process.env.REACT_APP_MAPS_API); // Google Maps API KEY from .env file


  const [locations, setLocations] = React.useState<Location[]>([]);
  const [locationTypes, setLocationTypes] = React.useState<LocationType[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);


  const [locID, setLocID] = React.useState('');
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [type, setType] = React.useState('');
  const [long, setLong] = React.useState('');
  const [lat, setLat] = React.useState('');
  const [risk, setRisk] = React.useState('');
  const [disruptions, setDisruptions] = React.useState<Disruption[]>([]);


  const [autocomplete, setAutocomplete] = React.useState<any>(null);
  const autoCompleteInputElement = document.getElementById("autocompleteValueField") as HTMLInputElement;
  const [isAdding, setIsAdding] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [locSnackbarOpen, setLocSnackbarOpen] = React.useState<boolean>(false);






  /**
   * Retrieves inital locations
   * Lifecycle hook --> ComponentDidMount
   */
  React.useEffect(() => {
    getLocationTypes();
    getLocations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  /**
   * Update location types
   */
  React.useEffect(() => {
    renameLocationTypes(locations);
  }, [locations, locationTypes])


  /**
   * Gets locations using get call and uses response data
   * and setLocations method to populate locations variable
   */
  const getLocations = () => {
    LocationService.getAllLocations().then(response => {
      //console.log(response)
      setLocations(response.data)
    })
  }


  /**
   * Retrieve all location types from DB
   */
  const getLocationTypes = () => {
    LocationService.getLocationTypes().then(response => {
      //console.log(response)
      setLocationTypes(response.data);
    })
  }


  /**
   * Traverses through locations array and renames types
   * if type id is found within type database
   *
   * Tried to pass in locations but likely not needed
   */
  const renameLocationTypes = (data: Location[]) => {
    for (let i = 0; i < data.length; i++) {
      const typeObject = locationTypes.find(x => x._id === data[i].type)
      if (typeObject !== undefined) {
        data[i].type = typeObject.type
      }
    }
  }


  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log('autocomplete: ', autocomplete)


    setAutocomplete(autocomplete)
  }


  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()


      // Set Latitude
      setLat(place.geometry.location.lat())
      // Set Longitude
      setLong(place.geometry.location.lng())
      // Set Address


      place.address_components.forEach((component: any) => {
        if (component.types[0] === 'street_number') {
          place.address_components.forEach((innerComponent: any) => {
            if (innerComponent.types[0] === 'route') {
              setAddress(component.short_name + ' ' + innerComponent.short_name)
            }
          })
        }
      })


      place.address_components.forEach((component: any) => {


        if (component.types[0] === 'locality') {
          setCity(component.short_name)
        }
      })


      place.address_components.forEach((component: any) => {
        if (component.types[0] === 'country') {
          setCountry(component.long_name)
        }
      })


    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }


  /**
   * Adds a location with location data passed in to the database
   * using a post call.
   *
   * @param locationData information about new location
   */
  const addLocation = async (locationData: Location) => {
    setLocSnackbarOpen(true);
    await LocationService.addLocation(locationData).then(response => {
      console.log(response)
    })
  }


  const updateLocation = async (locationData: Location) => {
    setLocSnackbarOpen(true);


    console.log(locationData);
    await LocationService.updateLocation(locationData).then(response => {
      console.log(response)
    })
  }


  /**
   * Called when form is submitted. Checks that all fields
   * are filled, auto generates an ID, and adds the new
   * location to the databse
   *
   * @param e event
   */
  const handleAdd = async (e: any) => {
    e.preventDefault()


    // Checks that every required field has at least been changed
    if (name && type && long && lat) {


      let typeString = ''
      const typeObject = locationTypes.find(x => x.type === type) // Success if String type matches on in array
      if (typeObject !== undefined) {
        typeString = typeObject._id!
      } else {
        typeString = type
      }


      // creates a location with data to be passed as a parameter
      const tempLocation = {
        // auto generates id
        name: name,
        address: address,
        city: city,
        country: country,
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        type: typeString,
        risk: 0,
        disruptions: []
      }


      try {
        await addLocation(tempLocation)
      } catch (error) {
        console.log(error) // logs any error in console
      } finally {
        getLocations() // gets locations now that one is added
      }
    }
    handleClose();
  }


  /**
   * Handles delete by attempting to delete a location with the id passed in.
   * Response is logged to console
   */
  const handleDelete = async (location: Location) => {
    setLocSnackbarOpen(true);


    console.log(location);


    await LocationService.deleteLocation(location).then(response => {
      console.log(response)
    })
  }


  /**
   * Handles updating the location entry by using the current values in the gloabl variables.
   * Similar to add, it creates a location object with the new data and passes it in as a parameter,
   * but also captures the id so the specific location can be referenced.
   *
   * @param e Handles updating
   */
  const handleUpdate = async (e: any) => {
    e.preventDefault()


    // Checks that every field is at least not empty
    if (name && address && city && country && type && long && lat) {


      let typeString = ''
      const typeObject = locationTypes.find(x => x.type === type) // Success if String type matches on in array
      if (typeObject !== undefined) {
        typeString = typeObject._id!
      } else {
        typeString = type
      }


      // Temporary location that is created to be passed in to update function
      const tempLocation = {
        _id: locID,
        name: name,
        address: address,
        city: city,
        country: country,
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        type: typeString,
        risk: parseFloat(risk),
        disruptions: disruptions
      }


      // attempts to update the location, catching and logging any error
      try {
        await updateLocation(tempLocation)
      } catch (error) {
        console.log(error)
      } finally {
        getLocations() // gets locations now that one is updated
      }
    }
    handleCloseUpdate();
  }


  /**
   * When the Add button is clicked, this opens the dialog popup
   */
  const handleClickOpen = () => {
    //setOpen(true);
    setIsAdding(true);
  };


  /**
   * When the Add form is needs to be closed, this closes it
   */
  const handleClose = () => {
    //setOpen(false);
    setIsAdding(false);
    setName('');
    setType('');


  };


  /**
   * When the update button is clicked, this opens the update form
   */
  const handleClickOpenUpdate = () => {
    //setOpenUpdate(true);
    setIsUpdating(true);
    setIsAdding(false);
  };


  /**
   * When the update form needs to be closed, this closes it
   */
  const handleCloseUpdate = () => {
    //setOpenUpdate(false);
    setIsUpdating(false);
    setName('');
    setType('');
  };


  /**
   * When a delete button is clicked, this opens the delete confirmation
   */
  const handleOpenDelete = () => {
    setOpenDelete(true); // opens the popup to confirm delete
  }


  /**
   * When the delete confirmation popup needs to be closed, this closes it
   */
  const handleCloseDelete = () => {
    setOpenDelete(false);
  }


  /**
   * Handles the event where a user confirms the delete. Calls handleDelete and passes
   * in location id. After delete is confirmed, locations on frontend are updated and the
   * confirmation popup is closed.
   */
  const handleDeleteConfirmed = async () => {


    const tempLocation = {
      // auto generates id
      _id: locID,
      name: name,
      address: address,
      city: city,
      country: country,
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      type: type,
      risk: parseFloat(risk),
      disruptions: disruptions
    }
   
    await handleDelete(tempLocation);
    getLocations(); // waits for handleDelete to finish so it doesn't synchronously call getLocations too early
    handleCloseDelete();
  }


  /**
   * Defines columns of the datagrid
   */
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', align: 'center', headerAlign: 'center', flex: 1 },
    { field: 'address', headerName: 'Address', align: 'center', headerAlign: 'center', flex: 1 },
    { field: 'city', headerName: 'City', align: 'center', headerAlign: 'center', flex: 1 },
    { field: 'country', headerName: 'Country', align: 'center', headerAlign: 'center', flex: 1 },
    { field: 'type', headerName: 'Type', align: 'center', headerAlign: 'center', flex: 1 },
    {
      field: 'latitude',
      headerName: 'Latitude',
      width: 100,
      type: 'number',
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'longitude',
      headerName: 'Longitude',
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'updateButton',
      headerName: '',
      width: 25,
      align: 'center',
      renderCell: (params) => {
        const onClick = () => {


          // Store values for this row globally to be used to prefill the form
          // console.log(params.row);
          setName(params.row.name);
          setAddress(params.row.address);
          setCity(params.row.city);
          setCountry(params.row.country);
          setType(params.row.type);
          setLong(params.row.longitude);
          setLat(params.row.latitude);
          setRisk(params.row.risk);
          setDisruptions(params.row.disruptions);


          setLocID(params.row._id); // used to reference it in update


          handleClickOpenUpdate();
        }
        return <Button onClick={onClick} size="small" variant="text"><EditIcon /></Button>;
      }


    },
    {
      field: 'deleteButton',
      headerName: '',
      width: 25,
      align: 'center',
      renderCell: (params) => {
        const onClick = () => {
          setLocID(String(params.id)); // stores id of location to delete


          setName(params.row.name);
          setAddress(params.row.address);
          setCity(params.row.city);
          setCountry(params.row.country);
          setType(params.row.type);
          setLong(params.row.longitude);
          setLat(params.row.latitude);
          setRisk(params.row.risk);
          setDisruptions(params.row.disruptions);


          handleOpenDelete();
        }
        return <Button onClick={onClick} size="small" variant="text" color="error"><DeleteIcon /></Button>;
      }
    }
  ];


  return (
    <Box sx={{ height: 'calc(100vh - 68.5px)', width: '100%', display: 'flex', justifyContent: 'center' }}>
      {/* Load Script */}
      <LoadScript googleMapsApiKey={API_KEY} id='google-map' libraries={["places"]}></LoadScript>
      <Snackbar
        open={locSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setLocSnackbarOpen(false)}
        message={`Location successfully added.`}
      />
      <div style={{ height: '100%', paddingLeft: '5%', paddingRight: '5%', width: '100%' }}>
        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          {(!isAdding && !isUpdating) && <Button
            onClick={handleClickOpen}
            variant="contained"
          ><AddCircleOutlineIcon fontSize="medium" sx={{ padding: '4px' }} />Add Location
          </Button>}
          {isAdding && <Card variant='outlined' sx={{ padding: '16px' }}>
            <Typography variant='h6'> <u>Adding Location</u></Typography>
            <Typography>Enter information of location within the supply chain.</Typography>
            <TextField id='standard-basic' label='Name' value={name} onChange={(e) => setName(e.target.value)} variant='standard' sx={{ width: '45%' }} />
            <TextField id='standard-basic' label='Type' value={type} onChange={(e) => setType(e.target.value)} variant='standard' sx={{ width: '45%' }} />
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <TextField id='autocompleteValueField' defaultValue='' name="autocompleteValue" label='Address' variant='standard' sx={{ width: '90%' }} />
            </Autocomplete>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleAdd}>Add</Button>
          </Card>}
          {isUpdating && <Card variant='outlined' sx={{ padding: '16px' }}>
            <Typography variant='h6'> <u>Updating Location</u></Typography>
            <Typography>Enter information of location within the supply chain.</Typography>
            <TextField id='standard-basic' label='Name' value={name} onChange={(e) => setName(e.target.value)} variant='standard' sx={{ width: '45%' }} />
            <TextField id='standard-basic' label='Type' value={type} onChange={(e) => setType(e.target.value)} variant='standard' sx={{ width: '45%' }} />
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <TextField id='autocompleteValueField' defaultValue='' name="autocompleteValue" label='Address' variant='standard' sx={{ width: '90%' }} />
            </Autocomplete>
            <Button onClick={handleCloseUpdate}>Cancel</Button>
            <Button type="submit" onClick={handleUpdate}>Update</Button>
          </Card>}


        </div>
        <DataGrid
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 10,
            borderRadius: 2,
            height: '80%'
          }}
          rows={locations}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
        {/* <Dialog fullWidth={true} maxWidth={'xs'} open={open} onClose={handleClose}>
          <form noValidate autoComplete='off' onSubmit={handleAdd}>
            <DialogTitle>Add a Location</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter information of location within the supply chain.
              </DialogContentText>
              <TextField id='standard-basic' label='Name' value={name} onChange={(e) => setName(e.target.value)} variant='standard' sx={{ width: '45%' }} />
              <TextField id='standard-basic' label='Type' value={type} onChange={(e) => setType(e.target.value)}variant='standard' sx={{ width: '45%' }} />
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <TextField id='autocompleteValueField' defaultValue='' name="autocompleteValue"label='Address' variant='standard' sx={{ width: '90%' }} />
              </Autocomplete>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleClose}>Add</Button>
            </DialogActions>
          </form>
        </Dialog> */}


        <Dialog fullWidth={true} maxWidth={'xs'} open={openUpdate} onClose={handleCloseUpdate}>
          <form noValidate autoComplete='off' onSubmit={handleUpdate}>
            <DialogTitle>Update a Location</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter information of location within the supply chain.
              </DialogContentText>
              <TextField
                onChange={(e) => setName(e.target.value)}
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                variant="standard"
                value={name}
              />
              <TextField
                onChange={(e) => setAddress(e.target.value)}
                margin="dense"
                id="address"
                label="Address"
                type="text"
                fullWidth
                variant="standard"
                value={address}
              />
              <TextField
                onChange={(e) => setCity(e.target.value)}
                margin="dense"
                id="city"
                label="City"
                type="text"
                fullWidth
                variant="standard"
                value={city}
              />
              <TextField
                onChange={(e) => setCountry(e.target.value)}
                margin="dense"
                id="country"
                label="Country"
                type="text"
                fullWidth
                variant="standard"
                value={country}
              />
              <TextField
                onChange={(e) => setType(e.target.value)}
                margin="dense"
                id="type"
                label="Type"
                type="text"
                fullWidth
                variant="standard"
                value={type}
              />
              <TextField
                onChange={(e) => setLat(e.target.value)}
                margin="dense"
                id="lat"
                label="Latitude"
                type="number"
                fullWidth
                variant="standard"
                value={lat}
              />
              <TextField
                onChange={(e) => setLong(e.target.value)}
                margin="dense"
                id="long"
                label="Longitude"
                type="number"
                fullWidth
                variant="standard"
                value={long}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdate}>Cancel</Button>
              <Button type="submit" onClick={handleCloseUpdate}>Update</Button>
            </DialogActions>
          </form>
        </Dialog>


        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this location?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This cannot be undone and the location will be gone forever.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button onClick={handleDeleteConfirmed} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>


      </div>
    </Box>


  );
}


export default Locations;