import LocationService from '../services/LocationService';

 
 /**
   * Retrieve all locations from DB
   */
  export const getLocations = (setLocations, locationsLoaded) => {
    LocationService.getAllLocations().then(response => {
      setLocations(response.data);
      locationsLoaded.current = true;
    });
  }