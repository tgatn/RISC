import Disruption from '../models/Disruption';
import Route from '../models/Route';
import http from './Service';

const RouteService = {
  getRoutes: function() {
    return http.get<Route[]>('/routes');
  },

  addRoute: function(route: Route) {
    return http.post<any>('/routes', route);
  },

  updateRoute: function(route: Route) {
    return http.put<any>('/routes', {
      route: route
    });
  },

  deleteRoute: function(route: Route) {
    return http.delete<any>(`/routes/${route._id}`);
  },

  addDisruptions: function(typeToAdd: string, disruptions: Disruption[]) {
    return http.post<any>('/routes/disruption', {
      disruption_type: typeToAdd, 
      existing_disruptions: disruptions,
      add: true
    });
  },

  removeDisruptions: function(typeToRemove: string, disruptions: Disruption[]) {
    return http.post<any>('/routes/disruption', {
      disruption_type: typeToRemove, 
      existing_disruptions: disruptions,
      add: false
    });
  },

  // TODO: Do we still need this?
  convertToGeojson: function(route: Route) {

  }
}

export default RouteService;