import LocationType from '../models/LocationType';
import Route from '../models/Route';
import MapLine from './MapLine';
import MapMarker from './MapMarker';

function MapRoute(props: { 'route': Route, 'routeRank': number, 'locationTypes': LocationType[] }) {
  return (
    <div>
      {
        props.route.locations.map(location => { // Renders map markers and marker info popups (on hover)
          return <MapMarker key={location._id} location={location} locationTypes={props.locationTypes}></MapMarker>
        })
      }

      {/* {
        props.route.edges.map((edge, index) => {
          return <MapLine key={index} edge={edge} routeRank={props.routeRank}></MapLine>
        })
      } */}
      
        <MapLine overall_risk={props.route.overall_risk}routeName={props.route.name} routeEdges={props.route.edges} polyline={props.route.polyline} routeRank={props.routeRank}></MapLine>
      
    </div>
  )
}

export default MapRoute;