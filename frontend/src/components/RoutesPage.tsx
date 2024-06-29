import React, { useEffect } from 'react';
import { Alert, Box, Button, Card, CardContent, FormControl,
         InputLabel, MenuItem, Select, Stack,
         Switch, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SouthIcon from '@mui/icons-material/South';
import SaveIcon from '@mui/icons-material/Save';
import './styles/SupplyChainRoutes.css'
import Location from '../models/Location';
import Route from '../models/Route';
import CircularProgress from '@mui/material/CircularProgress';
import { getRoutes, changeRouteName, deleteRoute,
         saveRoute, addRoute, changeStartEdgeType,
         changePathEdgeType, changeRouteStartingLocation,
         changeRouteDestination, changeRoutePathLocation, addPathPoint,
         deletePathPoint } from '../utils/RouteUtils';
import { getLocations } from "../utils/LocationUtils";

function RoutesPage() {

  // State //
  const [routes, setRoutes] = React.useState<Route[]>([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [loadPage, setLoadPage] = React.useState(false);

  // Refs //
  const locationsLoaded = React.useRef(false);

  useEffect(() => {
    getLocations(setLocations, locationsLoaded);
    getRoutes(setRoutes, setLoadPage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  // Clears success and error message after a certain period of time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Box className='scrollable' sx={{ height: 'calc(100vh - 68.5px)', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ position: "absolute", bottom: "20px", left: "20px", zIndex: "999", display: "flex", flexDirection: "column", gap: '12px' }}>
        {showSpinner ? <CircularProgress /> : ""}
        {error ? <Alert severity="error" onClose={() => { setError("") }}>
          {error}
        </Alert> : ""}
        {success ? <Alert severity="success" onClose={() => { setSuccess("") }}>
          {success}
        </Alert> : ""}
      </Box>
      <Box sx={{ width: '70%' }}>

        {/* Supply Chain Routes */}
        {!loadPage && "Loading Routes..."}
        {routes.map((r, rIndex) => (

          <Card sx={{ marginY: '16px' }} key={`Card of ${rIndex}`}>
            <CardContent key={`CardContent of ${rIndex}`}>
              <Box display='flex' alignItems='flex-start'>
                <Typography key={`Routes: Typography of ${rIndex}`} variant='h4' sx={{ marginRight: '10px' }}>Supply Chain Route: </Typography>
                <TextField
                  id='standard-basic'
                  label='Route Name'
                  value={r.name}
                  onChange={(e) => changeRouteName(routes, setRoutes, e.target.value, rIndex)}
                  variant='standard'
                  sx={{ marginTop: '-10px', width: '60%' }} // Adjust the marginTop to move the TextField slightly higher
                />
              </Box>



              <Typography key={`Path Point: Typography of ${rIndex}`} variant='h6' sx={{ marginTop: '16px' }}>Path Points</Typography>

              <Box key={`Start: Box of ${rIndex}`} sx={{ display: 'flex' }}>
                <FormControl key={`Start: FormControl of ${rIndex}`} fullWidth className='select-form'>
                  <InputLabel key={`Start: InputLabel of ${rIndex}`}>Path Point 1</InputLabel>
                  <Select
                    key={`Start: Select of ${rIndex}`}
                    value={JSON.stringify(r.start)}
                    label="Starting Location"
                    onChange={e => changeRouteStartingLocation(routes, setRoutes, e, rIndex)}
                  >
                    {locations.map((l, index) => {
                      return (
                        <MenuItem key={'routeStart' + index + rIndex} value={JSON.stringify(l)}>{l.name}</MenuItem>
                      )
                    })}
                  </Select>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SouthIcon />
                    <Typography>Sea</Typography>
                    <Switch checked={r.edges[0].type === "land"} onChange={() => changeStartEdgeType(routes, setRoutes, rIndex)} />
                    <Typography>Land</Typography>
                  </Stack>

                </FormControl>
              </Box>

              {r.edges.map((edge, edgeIndex) => { // Displays select input for 
                if (edgeIndex !== r.edges.length - 1) { // Removes the duplicate destination select form
                  return (
                    <Box key={`routePathPoint${edgeIndex}`} sx={{ display: 'flex' }}>
                      <FormControl fullWidth className='select-form'>
                        <InputLabel>{`Path Point ${edgeIndex + 2}`}</InputLabel>
                        <Box sx={{display: "flex"}}>
                            <Select
                            sx={{width: "100%", flexGrow: "3"}}
                              value={JSON.stringify(edge.to_location)}
                              label={`Path Point ${edgeIndex + 1}`}
                              onChange={e => changeRoutePathLocation(routes, setRoutes, e, rIndex, edgeIndex)}
                            >
                              {locations.map((l, index) => {
                                return (
                                  <MenuItem key={`routePathPoint${edgeIndex}Location${index}`} value={JSON.stringify(l)}>{l.name}</MenuItem>
                                )
                              })}
                            </Select>
                            <Button variant="outlined" color="error" onClick={() => deletePathPoint(routes, setRoutes, rIndex, edgeIndex)}><DeleteIcon /></Button>
                            </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <SouthIcon />
                          <Typography>Sea</Typography>
                          <Switch checked={r.edges[edgeIndex + 1].type === "land"} onChange={() => changePathEdgeType(routes, setRoutes, rIndex, edgeIndex + 1)} />
                          <Typography>Land</Typography>
                        </Stack>

                      </FormControl>
                    </Box>
                  )
                }
              })}

              <Box key={`Dest: Box of ${rIndex}`} sx={{ display: 'flex' }}>
                <FormControl key={`Dest: FormControl of ${rIndex}`} fullWidth className='select-form'>
                  <InputLabel key={`Dest: InputLabel of ${rIndex}`}>Path Point {r.edges.length + 1}</InputLabel>
                  <Select
                    key={`Dest: Select of ${rIndex}`}
                    value={JSON.stringify(r.end)}
                    label="Destination"
                    onChange={e => changeRouteDestination(routes, setRoutes, e, rIndex)}
                  >
                    {locations.map((l, index) => {
                      return (
                        <MenuItem key={'routeDestination' + index + rIndex} value={JSON.stringify(l)}>{l.name}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>

              <Box paddingY={'16px'} justifyContent='space-between' display='flex'>
                <Button fullWidth sx={{ padding: '8px' }} key={`addPathPoint: ${r} and ${rIndex}`} variant='outlined' disabled={r.start.name === '' || r.end.name === ''} onClick={() => addPathPoint(routes, setRoutes, r._id, rIndex)}>Add Path Point +</Button>
              </Box>

              <Box justifyContent='space-between' display='flex'>
                <Button startIcon={<SaveIcon />} key={`saveRoute: ${r} and ${rIndex}`} variant='contained' color='success' disabled={r.start.name === '' || r.end.name === ''} onClick={() => saveRoute(routes, setRoutes, r._id, rIndex, setShowSpinner, setIsAdding, setSuccess, setError)}>Save Route</Button>
                <Button endIcon={<DeleteIcon />} key={`deleteRoute: ${r} and ${rIndex}`} variant='contained' color='error' onClick={() => deleteRoute(routes, setRoutes, r._id, setIsAdding)}>Delete Route</Button>
              </Box>

            </CardContent>
          </Card>


        ))}

        <Card sx={{ marginY: '16px' }}>
          <CardContent>
            <Button disabled={isAdding} onClick={() => addRoute(routes, setRoutes, setIsAdding)}>Add Route</Button>
          </CardContent>
        </Card>

      </Box>
    </Box>

  );
}

export default RoutesPage;