import Disruption from "./Disruption";
import Location from "./Location";

export default interface RouteEdge {
  from_location: Location,
  to_location: Location,
  distance: number, // in miles
  risk: number,
  disruptions: Disruption[],
  type: String
}