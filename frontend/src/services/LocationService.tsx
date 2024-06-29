import http from './Service';
import Location from '../models/Location';
import LocationType from '../models/LocationType';


const LocationService = {
  getAllLocations: function() {
    return http.get<Location[]>('/locations');
  },


  getLocation: function(location: Location) {
    return http.get<Location>(`/locations/${location._id}`);
  },


  addLocation: function(locationData: Location) {
    return http.post('/locations', locationData);
  },


  updateLocation: function(locationData: Location) {
    return http.put(`/locations`, locationData);
  },


  deleteLocation: function(location: Location) {
    return http.delete(`/locations/${location._id}`);
  },


  getLocationTypes: function() {
    return http.get<LocationType[]>('/locations/types');
  }
}


export default LocationService;