import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Snackbar,
  Stack,
  Switch,
  Modal,
  Alert,
  Divider,
  Pagination
} from '@mui/material';
import { Autocomplete, GoogleMap, LoadScript } from '@react-google-maps/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './styles/SupplyChainRoutes.css';
import { amber, deepOrange, green, teal } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import SouthIcon from '@mui/icons-material/South';

import { debounce } from 'lodash';


import LocationService from '../services/LocationService';
import LocationType from '../models/LocationType';
import RouteService from '../services/RouteService';
import Route from '../models/Route';
import Location from '../models/Location';
import MapRoute from './MapRoute';
import Disruption from '../models/Disruption';
import DisruptionMarker from './DisruptionMarker';
import { useContext } from 'react';
import { ThemeContext, FilterContext } from './ThemeProviderWrapper';
import RouteEdge from '../models/RouteEdge';

import { Link } from 'react-router-dom';
import AssistantChatBox from './AssistantChatBox';

import { getRoutes } from '../utils/RouteUtils';

import { blueGrey, grey } from '@mui/material/colors'
import CloseIcon from '@mui/icons-material/Close';

function SupplyChainRoutes() {
  const [darkMode, toggleDarkMode] = useContext(ThemeContext);
  const [filterShow, toggleFilterShow] = useContext(FilterContext);

  const [mapOptions, setMapOptions] = useState(
    {
      minZoom: 1.5,
      styles: darkMode ? [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            {
              invert_lightness: 'true'
            },
            {
              hue: '#007A73' // Green color
            },
            {
              saturation: 0
            },
            {
              lightness: 5 // Darken the map
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '171717' // Black color for water
            }
          ]
        }
      ] : []
    })

    // Debounced function to update map options
    const debouncedSetMapOptions = useCallback(
      debounce((newOptions) => {
        setMapOptions(newOptions);
      }, 1000), // Adjust debounce delay (in milliseconds)
      [] // No dependencies, as we only want to create the debounced function once
    );
  
    // // Function to handle map option changes
    // const handleMapOptionsChange = (newOptions: any) => {
    //   debouncedSetMapOptions(newOptions); // Invoke debounced function with new options
    // };


  const API_KEY: string = String(process.env.REACT_APP_MAPS_API); // Google Maps API KEY from .env file
  const disruptionTypes: any[] = [
    // Contains all disruption categories and types
    {
      categoryName: 'Environmental',
      types: [
        'Earthquake',
        'Wildfire',
        'Flood',
        'Cyclone',
        'Drought',
        'Volcano',
      ],
    },
    {
      categoryName: 'Geopolitical',
      types: ['Unrest'],
    },
    {
      categoryName: 'Technology',
      types: ['Cyber', 'Data Breach'],
    },
    {
      categoryName: 'Man Made',
      types: ['Oil Spill'],
    },
    {
      categoryName: 'Economical',
      types: ['Embargo'],
    },
  ];

  const [routes, setRoutes] = React.useState<Route[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [locationTypes, setLocationTypes] = React.useState<LocationType[]>([]);
  const [disruptions, setDisruptions] = React.useState<Disruption[]>([]);
  const [disruptionToggledLoading, setDisruptionToggledLoading] = React.useState<any>(false);

  const [routeViewing, setRouteViewing] = React.useState<Route>();


  const [autocomplete, setAutocomplete] = React.useState<any>(null);

  const routesLoaded = React.useRef(false);
  const [loadPage, setLoadPage] = React.useState(false);



  const [locID, setLocID] = React.useState('');
  const [locName, setLocName] = React.useState('');
  const [locAddress, setLocAddress] = React.useState('');
  const [locCity, setLocCity] = React.useState('');
  const [locCountry, setLocCountry] = React.useState('');
  const [locType, setLocType] = React.useState('');
  const [locLon, setLocLon] = React.useState('');
  const [locLat, setLocLat] = React.useState('');
  const [risk, setRisk] = React.useState('');
  const [locDisruptions, setLocDisruptions] = React.useState<Disruption[]>([]);
  const [locSnackbarOpen, setLocSnackbarOpen] = React.useState<boolean>(false);
  const [routeSnackbarOpen, setRouteSnackbarOpen] = React.useState<boolean>(false);
  const [lastLocName, setLastLocName] = React.useState('');


  // Pagination
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const routesPerPage = 3;

  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = routes.slice(indexOfFirstRoute, indexOfLastRoute);

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [disruptionModalOpen, setDisruptionModalOpen] = React.useState(false);

  // hold disruption values
  const [disruptionTitle, setDisruptionTitle] = React.useState('');
  const [disruptionType, setDisruptionType] = React.useState('');
  const [disruptionLat, setDisruptionLat] = React.useState('');
  const [disruptionLong, setDisruptionLong] = React.useState('');
  const [disruptionRisk, setDisruptionRisk] = React.useState('');

  const autoCompleteInputElement = document.getElementById("autocompleteValueField") as HTMLInputElement;

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log('autocomplete: ', autocomplete)

    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()

      // Set Latitude
      setLocLat(((place.geometry.viewport.Zh.lo + place.geometry.viewport.Zh.hi) / 2).toString())
      // Set Longitude
      setLocLon(((place.geometry.viewport.Jh.lo + place.geometry.viewport.Jh.hi) / 2).toString())
      // Set Address

      place.address_components.forEach((component: any) => {
        if (component.types[0] === 'street_number') {
          place.address_components.forEach((innerComponent: any) => {
            if (innerComponent.types[0] === 'route') {
              setLocAddress(component.short_name + ' ' + innerComponent.short_name)
            }
          })
        }
      })

      place.address_components.forEach((component: any) => {

        if (component.types[0] === 'locality') {
          setLocCity(component.short_name)
        }
      })

      place.address_components.forEach((component: any) => {
        if (component.types[0] === 'country') {
          setLocCountry(component.long_name)
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
    await LocationService.addLocation(locationData).then(response => {
      console.log(response)
    })
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()

    setLastLocName(locName)

    // creates a location with data to be passed as a parameter
    const tempLocation = {
      // auto generates id 
      name: locName,
      address: locAddress,
      city: locCity,
      country: locCountry,
      latitude: parseFloat(locLat),
      longitude: parseFloat(locLon),
      type: locType,
      risk: 0,
      disruptions: []
    }

    try {
      await addLocation(tempLocation)
    } catch (error) {
      console.log(error) // logs any error in console
    } finally {
      setLocSnackbarOpen(true)
      setLocName('')
      setLocAddress('')
      setLocCity('')
      setLocCountry('')
      setLocType('')
      setLocLon('')
      setLocLat('')

    }
    getLocations();
    if (autoCompleteInputElement) {
      autoCompleteInputElement.value = '';
    }
    // }
  }

  const handleDisruptionDetailsOpen = (route : Route) => {
    console.log("opened route", route)
    setDisruptionModalOpen(true);
    setRouteViewing(route)
  }

  const handleAddDisruption = async (e: any) => {
    e.preventDefault()

    if (parseFloat(disruptionLat) < -90 || parseFloat(disruptionLat) > 90) {
      window.alert('Latitude is out of bounds');
      return; 
    } else if (parseFloat(disruptionLong) < -180 || parseFloat(disruptionLong) > 180) {
      window.alert('Longitude is out of bounds');
      return; 
    }

    // creates a disruption with data to be passed as a parameter
    const tempDisruption: Disruption = {
      // auto generates id 
      title: disruptionTitle,
      type: disruptionType,
      latitude: parseFloat(disruptionLat),
      longitude: parseFloat(disruptionLong),
      risk: parseFloat(disruptionRisk),
      description: ''
    }

    try {
      disruptions.push(tempDisruption);
      await RouteService.addDisruptions("custom", disruptions).then((response) => {
        setRoutes(response.data.routes);
      });

    } catch (error) {
      console.log(error) // logs any error in console
    } finally {
      setDisruptionTitle('');
      setDisruptionType('');
      setDisruptionLat('');
      setDisruptionLong('');
      setDisruptionRisk('');

    }

  }


  /**
   * Retrieves inital routes
   * Lifecycle hook --> ComponentDidMount
   */
  React.useEffect(() => {
    getLocations();
    getLocationTypes();
    getRoutes(setRoutes, setLoadPage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  /**
   * Retrieve all locations from DB
   */
  const getLocations = () => {
    LocationService.getAllLocations().then(response => {
      setLocations(response.data);
    });
  }

  const testNew: Route = {
    start: {
      name: '',
      address: '',
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
      type: '',
      risk: 0,
      disruptions: []
    },
    end: {
      name: '',
      address: '',
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
      type: '',
      risk: 0,
      disruptions: []
    },
    locations: [],
    edges: [
      {
        from_location: {
          name: '',
          address: '',
          city: '',
          country: '',
          latitude: 0,
          longitude: 0,
          type: '',
          risk: 0,
          disruptions: []
        },
        to_location: {
          name: '',
          address: '',
          city: '',
          country: '',
          latitude: 0,
          longitude: 0,
          type: '',
          risk: 0,
          disruptions: []
        },
        distance: 0, // in miles
        risk: 0,
        disruptions: [],
        type: 'sea'
      }
    ],
    polyline: [],
    overall_risk: 0,
    disruptions: [],
    name: ''
  }

  const [emptyRoute, setEmptyRoute] = React.useState<Route>(testNew);

  const changeRouteStartingLocation = (e: any) => {

    const r = emptyRoute;

    let edges = r.edges;

    if (edges.length > 0) {
      edges[0].from_location = JSON.parse(e.target.value);
      r.start = JSON.parse(e.target.value);
    } else {
      const newEdge: RouteEdge = {
        from_location: JSON.parse(e.target.value),
        to_location: {
          name: '',
          address: '',
          city: '',
          country: '',
          latitude: 0,
          longitude: 0,
          type: '',
          risk: 0,
          disruptions: []
        },
        distance: 0,
        risk: 0,
        disruptions: [],
        type: 'sea'
      }
      edges.push(newEdge);
      r.start = JSON.parse(e.target.value);
    }


    setEmptyRoute(prevRoute => {
      return { ...prevRoute, start: r.start, path: r.edges }
    });
    console.log("Changing starting location");
    console.log(emptyRoute);
  }

  /**
   * Updates the destination of the specified route
   * @param e Event fired when location is selected from dropdown
   * @param route Which route was updated
   */
  const changeRouteDestination = (e: any) => {
    const r = emptyRoute;
    let edges = r.edges;

    if (edges.length > 0) {
      edges[edges.length - 1].to_location = JSON.parse(e.target.value);
      r.end = JSON.parse(e.target.value);
    } else {
      const newEdge: RouteEdge = {
        to_location: JSON.parse(e.target.value),
        from_location: {
          name: '',
          address: '',
          city: '',
          country: '',
          latitude: 0,
          longitude: 0,
          type: '',
          risk: 0,
          disruptions: []
        },
        distance: 0,
        risk: 0,
        disruptions: [],
        type: 'sea'
      }
      edges.push(newEdge);
      r.end = JSON.parse(e.target.value);
    }

    // const newRoutes = routes.map((ro, idx) => {
    //   if (idx === id) {
    //     console.log(r);
    //     return r;
    //   } else {
    //     return ro;
    //   }

    // });
    // setRoutes(newRoutes);
    setEmptyRoute(prevRoute => {
      return { ...prevRoute, path: r.edges }
    });
    console.log("Changing final location");
    console.log(emptyRoute);
  }




  /**
   * Updates an edge within the specified route's path
   * @param e Event fired when location is selected from dropdown
   * @param route Which route was updated
   * @param edgeIndex Which path edge to update
   */
  const changeRoutePathLocation = (e: any, edgeIndex: number) => {

    //if (routeNumber === '1') {
    let edges = emptyRoute.edges;

    edges[edgeIndex].to_location = JSON.parse(e.target.value);
    edges[edgeIndex + 1].from_location = JSON.parse(e.target.value);

    setEmptyRoute(prevRoute => {
      return { ...prevRoute, edges: edges }
    });
    console.log("Changing path point");
    console.log(emptyRoute);
    //}
  }


  /**
   * Adds an edges to the end of the specified route
   * @param routeNumber Which route was updated
   */
  const addPathPoint = () => {
    const newEdge: RouteEdge = {
      to_location: {
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        type: '',
        risk: 0,
        disruptions: []
      },
      from_location: {
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        type: '',
        risk: 0,
        disruptions: []
      },
      distance: 0,
      risk: 0,
      disruptions: [],
      type: 'sea'
    }
    const newLocation: Location = {
      name: '',
      address: '',
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
      type: '',
      risk: 0,
      disruptions: []
    }
    let edges = emptyRoute.edges;
    let indexToAdd = edges.length;
    edges.push(newEdge);
    edges[indexToAdd].to_location = emptyRoute.end;
    edges[indexToAdd - 1].to_location = newLocation;

    setEmptyRoute(prevRoute => {
      return { ...prevRoute, edges: edges }
    });
    console.log("Adding path point");
    console.log(emptyRoute);

  }


  const changeStartEdgeType = () => {

    let edges = emptyRoute.edges;
    console.log(edges);

    edges[0].type === "sea" ? edges[0].type = "land" : edges[0].type = "sea"
    setEmptyRoute(prevRoute => {
      return { ...prevRoute, edges: edges }
    });

    console.log(emptyRoute);
  }

  const changePathEdgeType = (edgeIndex: number) => {

    let edges = emptyRoute.edges;

    edges[edgeIndex].type === "sea" ? edges[edgeIndex].type = "land" : edges[edgeIndex].type = "sea"
    setEmptyRoute(prevRoute => {
      return { ...prevRoute, edges: edges }
    });
    console.log(emptyRoute);
  }


  /**
   * Deletes a specified path in the specified route
   * @param routeNumber Which route to update
   * @param edgeIndex Which path edge to update
   */
  const deletePathPoint = (edgeIndex: number) => {
    // console.log(routeNumber, edgeIndex)

    console.log("Deleting PAth point...");
    let edges = emptyRoute.edges;

    edges.splice(edgeIndex, 1); // Remove edge
    // Update the route connnections
    if (edgeIndex === 0) {
      edges[0].from_location = emptyRoute.start;
    } else {
      edges[edgeIndex].from_location = edges[edgeIndex - 1].to_location;
    }

    setEmptyRoute(prevRoute => {
      return { ...prevRoute, edges: edges }
    });
    console.log("Deleting path point");
    console.log(emptyRoute);

  }

  const changeRouteName = (name: any) => {

    let newName = emptyRoute.name;
    newName = name;
    setEmptyRoute(prevRoute => {
      return { ...prevRoute, name: newName }
    });
    console.log("Changing route name");
    console.log(emptyRoute.name);
  }

  const saveRoute = async () => {
    if (emptyRoute.name === "") {
      emptyRoute.name = emptyRoute.start.name + " to " + emptyRoute.end.name;
      setEmptyRoute(prevRoute => {
        return { ...prevRoute, name: emptyRoute.name }
      });
    }
    console.log("NAMEMMEANFVJDFNVJFD");
    console.log(emptyRoute);
    await RouteService.addRoute(emptyRoute);
    setEmptyRoute(testNew);
    console.log("SAVEDDDD")
    getRoutes(setRoutes, setLoadPage);
    setRouteSnackbarOpen(true)
    console.log(routes);

  }

  /**
   * Retrieve all location types from DB
   */
  const getLocationTypes = () => {
    LocationService.getLocationTypes().then((response) => {
      console.log('Location Types Response:', response);
      setLocationTypes(response.data);
    });
  };

  /**
   * Event fired when a disruption type is toggled
   * @param event Checkbox Change event -- Allows us to access checked state
   * @param type Disruption type (un)checked
   */
  const disruptionToggled = (event: any, type: string) => {

    setDisruptionToggledLoading(true)

    if (event.target.checked) {
      RouteService.addDisruptions(type, disruptions).then((response) => {
        setRoutes(response.data.routes);
        setDisruptions(response.data.disruptions);
        setDisruptionToggledLoading(false)

      });
    } else {
      RouteService.removeDisruptions(type, disruptions).then((response) => {
        setRoutes(response.data.routes);
        setDisruptions(response.data.disruptions);
        setDisruptionToggledLoading(false)
      });
    }

    
  };

  /**
   * Returns information to display about a specified route within the route information card
   * @param route Route being displayed
   * @param index Index within route list
   * @returns Route information to display in route card
   */
  const getRouteInfo = (route: Route, index: number) => {
    let totalDistance = 0;

    route.edges.forEach((edge) => {
      // Get total distance of route
      totalDistance += edge.distance;
    });

    let routeString = '';
    let color = '';

    // Set title and color of route card
    if (route.overall_risk < 34) {
      routeString = 'Primary Route';
      color = green[500];
    } else if (route.overall_risk >= 34 && route.overall_risk < 67) {
      routeString = 'Secondary Route';
      color = amber[500];
    } else if (route.overall_risk >= 67) {
      routeString = 'Tertiary Route';
      color = deepOrange[500];
    } else {
      routeString = 'Unlabeled Route';
      color = '#777'
    }
       
      routeString = route.name
       
      return (
        <Box>
          <Typography
            sx={{fontWeight: 'bold'}}
            paddingBottom={''}
            color={color}
          >{`${routeString}`}</Typography>
          <Typography
            paddingBottom={''}
            color="text.secondary"
          >{`(${totalDistance.toFixed(2)} miles)`}</Typography>
          <Typography>
          {`${route.disruptions.length}`} disruptions, Risk = {`${route.overall_risk}`}
          </Typography>
        </Box>
      );
  };

  return (

    <Box sx={{ height: 'calc(100vh - 68.5px)' }}>
          <Modal
            open={disruptionModalOpen}
            onClose={() => setDisruptionModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            
            <Box sx={modalStyle}>
            <Button sx={{position: "absolute", top: "10px", right: "10px"}} color="error" onClick={() => setDisruptionModalOpen(false)}><CloseIcon/></Button>
            <Typography id="modal-modal-title" variant="h5" color="text.secondary" component="h2">
                Disruptions for
              </Typography>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                { routeViewing && routeViewing.name}
              </Typography>
              <Divider sx={{marginY: "4px"}} />
              <Typography id="modal-modal-title" variant="h5" component="h2">
                Risk: <span style={{fontFamily: "monospace"}}>{ routeViewing && routeViewing.overall_risk}</span>
              </Typography>
              {routeViewing && routeViewing.overall_risk >= 67 ? <Alert severity="error" sx={{marginBottom: "8px"}}>High Risk</Alert> : routeViewing && routeViewing.overall_risk >= 34 ? <Alert severity="warning" sx={{marginBottom: "8px"}}>Medium Risk</Alert> : <Alert severity="success" sx={{ marginBottom: "8px"}}>Low Risk</Alert>}
              {/* <Alert severity="success" sx={{width: "50%"}}>Low Risk</Alert>
              <Alert severity="warning" sx={{width: "50%"}}>Medium Risk</Alert>
              <Alert severity="error" sx={{width: "50%"}}>High Risk</Alert> */}
              <Box sx={darkMode ? { height: "300px", padding: "4px", overflowY: "scroll", backgroundColor: grey[800], borderRadius: "8px"} : { height: "200px", padding: "8px", overflowY: "scroll", backgroundColor: grey[100], borderRadius: "8px"} }>
              {routeViewing && routeViewing.disruptions.length > 0 ? routeViewing.disruptions.map((disruption) => {
                return <Card sx={{marginBottom: "8px", padding: "8px"}}>
                  <Typography id="modal-modal-description" sx={{ mt: 2, lineHeight: "1" }} variant="h6" >
                {/* {JSON.stringify(disruption)} */}
                {disruption.title}
              </Typography>
              <Typography id="modal-modal-description" color="primary">
                Type: {disruption.type.toUpperCase()}
              </Typography>
              <Typography id="modal-modal-description" color="text.secondary">
                Risk score: {disruption.risk}
              </Typography>
              </Card>
              }) : 'No disruptions to display.' }
              </Box>
            </Box>
          </Modal>
      {/* Load Script */}
      <LoadScript googleMapsApiKey={API_KEY} id='google-map' libraries={["places"]}>
        {' '}
        {/* Subtracts height of Navbar */}
        <Grid
          className='height-100'
          container
          spacing={1}
          overflow={{ xs: 'scroll' }}
          marginTop={0}
        >
          <Grid
            item
            // className='scrollable'
            xs={12}
            md={3}
            height={{ xs: 'auto', md: '100%' }}
          >

            <Card variant='outlined' sx={{ paddingY: '4px', marginLeft: '16px', height: "50vh", marginBottom: "4px" }}>
              <Box sx={{ overflow: 'auto', height: '100%' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    Add Route
                  </Typography>

                  <FormControl size="small" fullWidth sx={{ display: 'flex', marginBottom: '24px', marginTop: '4px', width: '100%' }} >
                    <TextField
                      id='standard-basic'
                      label='Route Name'
                      value={emptyRoute.name}
                      onChange={(e) => changeRouteName(e.target.value)}
                      variant='standard'
                      sx={{ marginTop: '-10px' }}
                    />
                  </FormControl>


                  <FormControl size="small" fullWidth sx={{ marginBottom: '8px' }}>
                    <InputLabel id='start-select-label'>Path Point 1</InputLabel>
                    <Select
                      value={JSON.stringify(emptyRoute.start)}
                      label='Start'
                      onChange={(e) => changeRouteStartingLocation(e)}
                    >
                      {locations.map((l, index) => {
                        return (
                          <MenuItem key={'routeStart' + index} value={JSON.stringify(l)}>{l.name}</MenuItem>
                        )
                      })}
                    </Select>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <SouthIcon />
                      <Typography>Sea</Typography>
                      <Switch checked={emptyRoute.edges[0].type === "land"} onChange={() => changeStartEdgeType()} />
                      <Typography>Land</Typography>
                    </Stack>
                  </FormControl>

                  {emptyRoute.edges.map((edge, edgeIndex) => { // Displays select input for 
                    if (edgeIndex !== emptyRoute.edges.length - 1) { // Removes the duplicate destination select form
                      return (
                        <Box key={`routePathPoint${edgeIndex}`} sx={{ display: 'flex', width: "100%" }}>
                          <FormControl size="small" className='select-form' fullWidth>
                            <InputLabel>{`Path Point ${edgeIndex + 2}`}</InputLabel>
                            <Box sx={{display: "flex"}}>
                            <Select
                            sx={{width: "100%", flexGrow: "3"}}
                              value={JSON.stringify(edge.to_location)}
                              label={`Path Point ${edgeIndex + 1}`}
                              onChange={e => changeRoutePathLocation(e, edgeIndex)}
                            >
                              {locations.map((l, index) => {
                                return (
                                  <MenuItem key={`routePathPoint${edgeIndex}Location${index}`} value={JSON.stringify(l)}>{l.name}</MenuItem>
                                )
                              })}
                            </Select>
                            <Button variant="outlined" color="error" onClick={() => deletePathPoint(edgeIndex)}><DeleteIcon /></Button>
                            </Box>

                            <Stack direction="row" spacing={1} alignItems="center">
                              <SouthIcon />
                              <Typography>Sea</Typography>
                              <Switch checked={emptyRoute.edges[edgeIndex + 1].type === "land"} onChange={() => changePathEdgeType(edgeIndex + 1)} />
                              <Typography>Land</Typography>
                            </Stack>
                          </FormControl>
                          
                        </Box>
                      )
                    }
                  })}


                  <FormControl size="small" fullWidth sx={{ marginBottom: '8px' }}>
                    <InputLabel id='destination-select-label'>Path Point {emptyRoute.edges.length + 1}</InputLabel>
                    <Select
                      labelId='destination-select-label'
                      id='demo-simple-select'
                      label='Destination'
                      value={JSON.stringify(emptyRoute.end)}
                      onChange={e => changeRouteDestination(e)}
                    >
                      {locations.map((l, index) => {
                        return (
                          <MenuItem key={'routeStart' + index} value={JSON.stringify(l)}>{l.name}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>

                  <Button size='small' disabled={emptyRoute.start.name === '' || emptyRoute.end.name === ''} variant='outlined' fullWidth sx={{ padding: '8px' }} onClick={() => addPathPoint()}>Add Path Point +</Button>

                </CardContent>
                <CardActions>

                  <Button size='small'><Link to="/routes" style={{ textDecoration: 'none', color: 'inherit' }}>View Routes</Link></Button>
                  <Button size='small' disabled={emptyRoute.start.name === '' || emptyRoute.end.name === ''} variant='contained' onClick={() => saveRoute()}>Add +</Button>
                </CardActions>
              </Box>
            </Card>
            <Snackbar
              open={locSnackbarOpen}
              autoHideDuration={3000}
              onClose={() => setLocSnackbarOpen(false)}
              message={`Location ${lastLocName} successfully added.`}
            />
            <Snackbar
              open={routeSnackbarOpen}
              autoHideDuration={3000}
              onClose={() => setRouteSnackbarOpen(false)}
              message={`Route successfully added.`}
            />
            {/* <Card variant='outlined' sx={{ paddingY: '4px', marginLeft: '16px', height: "35vh" }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                  Add Location
                </Typography>

                <TextField id='standard-basic' label='Name' value={locName} onChange={(e) => setLocName(e.target.value)} variant='standard' sx={{ width: '45%' }} />
                <TextField id='standard-basic' label='Type' value={locType} onChange={(e) => setLocType(e.target.value)} variant='standard' sx={{ width: '45%' }} />
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <TextField id='autocompleteValueField' defaultValue='' name="autocompleteValue" label='Address' variant='standard' sx={{ width: '90%' }} />
                </Autocomplete>

              </CardContent>
              <CardActions>
                <Button size='small'><Link to="/locations" style={{ textDecoration: 'none', color: 'inherit' }}>View Locations</Link></Button>
                <Button size='small' disabled={locName === '' || locType === '' || autoCompleteInputElement.value === ''} variant='contained' onClick={(e) => handleAdd(e)}>Add +</Button>
              </CardActions>
            </Card> */}
            <Card variant='outlined' sx={{ paddingY: '4px', marginLeft: '16px', height: "35vh" }}>
              <Box sx={{ overflow: 'auto', height: '100%' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    Add Disruption
                  </Typography>

                  <TextField size="small" type="text" id='standard-basic' label='Title' value={disruptionTitle} onChange={(e) => setDisruptionTitle(e.target.value)} variant='standard' sx={{ width: '45%' }} />
                  <TextField size="small" type="text" id='standard-basic' label='Type' value={disruptionType} onChange={(e) => setDisruptionType(e.target.value)} variant='standard' sx={{ width: '45%', marginLeft: "4px" }} />
                  <TextField size="small" type="number" id='standard-basic' label='Lat' value={disruptionLat} onChange={(e) => setDisruptionLat(e.target.value)} variant='standard' sx={{ width: '45%' }} />
                  <TextField size="small" type="number" id='standard-basic' label='Long' value={disruptionLong} onChange={(e) => setDisruptionLong(e.target.value)} variant='standard' sx={{ width: '45%', marginLeft: "4px" }} />
                  <FormControl size="small" className='select-form' sx={{ paddingY: '0px', width: "91%" }}>
                    <InputLabel>Risk</InputLabel>
                    <Select
                      value={disruptionRisk}
                      label={"Risk"}
                      onChange={e => setDisruptionRisk(e.target.value)}
                    >

                      <MenuItem value={"0"}>0</MenuItem>
                      <MenuItem value={"1"}>1</MenuItem>
                      <MenuItem value={"2"}>2</MenuItem>
                      <MenuItem value={"2.5"}>2.5</MenuItem>

                    </Select>
                  </FormControl>

                </CardContent>
                <CardActions>
                  <Button 
                    sx={{marginLeft: '8px', marginTop: '-16px'}}
                    disabled={disruptionTitle === '' || disruptionType === '' || disruptionLat === '' || disruptionLong === '' || disruptionRisk ===''} 
                    size='small' 
                    variant='contained' 
                    onClick={(e) => handleAddDisruption(e)}>Add +</Button>
                    
                </CardActions>
              </Box>
            </Card>
            <Box sx={{ position: 'absolute', top: '75px', right: '0', zIndex: '999'}}>
              {disruptionTypes.map((category) => {
                return (
                  <Accordion disableGutters
                    key={category.categoryName}
                    sx={filterShow ? { color: teal[50], backgroundColor: teal[900]} : { display: 'none' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{category.categoryName.toUpperCase()}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {(category.types as string[]).map((type) => {
                          return (
                            <FormControlLabel
                              key={type}
                              control={<Checkbox /*defaultChecked*/ />}
                              disabled={
                                type === 'Data Breach' ||
                                type === 'Oil Spill' ||
                                type === 'Embargo' ||
                                disruptionToggledLoading
                              }
                              label={type}
                              onChange={(e) => disruptionToggled(e, type)}
                              sx={{
                                color: teal[100],
                                '&.Mui-checked': { color: teal[600] },
                              }}
                            />
                          );
                        })}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Grid>
          <Grid
            item
            // className='scrollable'
            xs={12}
            md={9}
            height={{ xs: 'inherit', md: '100%' }}
          >
            {/* <Typography
            sx={{
              color: teal[700],
              minHeight: '48px',
              padding: '0 16px',
              lineHeight: '48px',
            }}
          >
            WORLD MAP
          </Typography> */}

            <Box sx={{ height: '50vh', paddingRight: '16px' }}>
              {' '}
              {/* Subtracts height of World Map title + margins */}


              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '55vh', borderRadius: '8px' }}
                center={{ lat: 0, lng: 0 }}
                zoom={2}
                options={mapOptions}
              >
                {/* Child components, such as markers, info windows, etc. */}

                {routes.map((route, index) => {
                  // Renders map markers, map edges, and info popups (on hover)
                  return (
                    <MapRoute
                      key={index}
                      route={route}
                      routeRank={index}
                      locationTypes={locationTypes}
                    ></MapRoute>
                  );
                })}

                {disruptions.map((disruption, index) => {
                  // Renders disruptions onto map
                  return (
                    <DisruptionMarker
                      key={disruption.type + index}
                      disruption={disruption}
                    ></DisruptionMarker>
                  );
                })}
              </GoogleMap>
              <Box paddingY={'4px'}>
                <Card variant='outlined' sx={{ height: "30vh" }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                      Route Information
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '16px', height: '20vh' }}>
                      {loadPage ? currentRoutes.map((route, index) => {
                        return (
                          <Card sx={{ height: "110%", width: "100%", overflow: 'auto' }} key={'routeCard' + index}>
                            <CardContent sx={{ paddingBottom: 0 }}>{getRouteInfo(route, index)}</CardContent>
                            <CardActions>
                              <Button onClick={() => {
                                handleDisruptionDetailsOpen(route)
                              }}size='small'>Details</Button>
                            </CardActions>
                          </Card>
                        );

                      }) : <Typography color='text.secondary'>
                        No routes to display.
                      </Typography>}
                      </Box>
                      {routes.length > routesPerPage && (
                        <Pagination
                        count={Math.ceil(routes.length / routesPerPage)}
                        page={currentPage}
                        onChange={(e, value) => setCurrentPage(value)}
                        />
                      )}
                      

                    </Box>

                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </LoadScript>
      <AssistantChatBox routes={routes} />
    </Box>
  );
}

export default SupplyChainRoutes;
