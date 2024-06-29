from dataclasses import dataclass, field
from typing import List
from utilities.util import get_distance_from_latlng
from models.location import Location
from models.route_edge import RouteEdge
from models.disruption import Disruption
from models.route_coordinate import RouteCoordinate

LOCATION_DISTANCE = 1000 # NOTE: Change based on how long items are estimated to be at a location
C = 0.136 # NOTE: Constant derived based on 0-3 scale in formula w = d + cd(r^1.5)
@dataclass
class Route:
  _id: str
  name: str
  locations: List[Location]
  polyline: List[List[float]]
  edges: List[RouteEdge]
  start: Location
  end: Location
  overall_risk: float = 0
  disruptions: List[Disruption] = field(default_factory=lambda: [])

  
  # Route construtor from MongoDB object
  @classmethod
  def from_db_object(cls, route, all_locations: List[Location]):

    # Helper function to find Location object from all_locations list by id
    def find_by_id(id: str):
      result = list(filter(lambda location: location._id == id, all_locations))
      return result[0]

    route_id: str = str(route['_id'])
    start_location: Location = find_by_id(route['start']) 
    end_location: Location = find_by_id(route['end'])
    name: str = str(route['name'])
    locations: List[Location] = []
    edges: List[RouteEdge] = []
    polyline: List[List[float]] = route['polyline']


    # Iterate through path and compile list of locations and edges
    for index, edge in enumerate(route['path']):

      path_from: Location = find_by_id(edge[0])
      path_to: Location = find_by_id(edge[1])
      type = edge[2]

      if index == 0:
        locations.append(path_from)

      locations.append(path_to)
      distance = get_distance_from_latlng(path_from.latitude, path_from.longitude, path_to.latitude, path_to.longitude)
      edges.append(RouteEdge(path_from, path_to, distance, type=type))




    return cls(_id=route_id, locations=locations, edges=edges, start=start_location, end=end_location, name=name, polyline=polyline) # Create the Route object

  # def set_route_coordinates(list: List, self):
  #   points: List[RouteCoordinate] = []
    
  #   for coor in list:
  #     RouteCoordinate(coor[1], coor[0])
  #     points.append(RouteCoordinate)

  #   return 

  # Calculate overall risk of entire route
  def calculate_risk(self):
    # for l in self.locations:
    #   self.overall_risk += (LOCATION_DISTANCE + (LOCATION_DISTANCE * C * (3 * l.risk)**1.5))

    # for e in self.edges:
    #   self.overall_risk += (e.distance + (e.distance * C * (3 * e.risk)**1.5))
    self.overall_risk = 0

    return