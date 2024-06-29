import Disruption from "./Disruption";
import Location from "./Location"
import RouteEdge from "./RouteEdge";

export default interface Route {
  _id?: string,
  locations: Location[],
  edges: RouteEdge[],
  start: Location,
  end: Location,
  overall_risk: number,
  disruptions: Disruption[],
  name: string,
  polyline: number[][]
}