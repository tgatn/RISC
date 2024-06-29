import Disruption from "./Disruption";

export default interface Location {
  _id?: string,
  name: string,
  address: string,
  city: string,
  country: string,
  latitude: number,
  longitude: number,
  type: string,
  risk: number,
  disruptions: Disruption[]
}