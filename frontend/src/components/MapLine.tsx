import React from 'react';
import { InfoWindow, Polyline } from '@react-google-maps/api';

import './styles/SupplyChainRoutes.css'
import RouteEdge from '../models/RouteEdge';
import { amber, deepOrange, green } from '@mui/material/colors';

function MapLine(props: { 'routeName': string, 'routeEdges' : RouteEdge[] ,'polyline': number[][], 'routeRank': number, 'overall_risk': number }) {

  const [showInfoWindow, setInfoWindowVisibility] = React.useState<boolean>(false); // Info window visibility
  const [path, setPath] = React.useState<any[]>() // Path of edge (start point + end point)
  const [mousePosition, setMousePosition] = React.useState<google.maps.LatLng | undefined>() // LatLng of mouse position 
  const [routeColor, setColor] = React.useState<string>('#000000'); // Color of route 

  const [totalDistance, setTotalDistance] = React.useState<string>("");


  const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 3,
  };


  /**
   * Update the path coordinates and midpoint on properties update
   */
  React.useEffect(() => {

    const routeCoordinatesTransformed : any[] = []

    props.polyline.forEach((pair) => {
      let obj = {
        lat: pair[1],
        lng: pair[0]
      }

      // console.log(obj)

      routeCoordinatesTransformed.push(obj)

    })
    
    setPath(routeCoordinatesTransformed)

    let totalDistanceTemp = 0
    props.routeEdges.forEach((edge) => {
      // Get total distance of route
      totalDistanceTemp += edge.distance;
    });

    setTotalDistance(totalDistanceTemp.toFixed(2).toString())

    


    if (props.routeRank === 0) {
      setColor('#f68ef2');
    } else if (props.routeRank === 1) {
      setColor('#FFA500');
    } else if (props.routeRank === 2) {
      setColor('#FF0000');
    } else {
      setColor("#777")
    }

    if (props.overall_risk < 34) {
      setColor(green[500]);
    } else if (props.overall_risk >= 34 && props.overall_risk < 67) {
      setColor(amber[500]);
    } else if (props.overall_risk >= 67) {
      setColor(deepOrange[500]);
    } else {
      setColor("#777");
    }
    
  }, [props]);


  /**
   * Sets the position of the InfoWindow and sets visibility to true
   * @param e Mouse event 
   */
  const openEdgeInfoWindow = (e: google.maps.MapMouseEvent) => {
    setMousePosition(e.latLng as google.maps.LatLng);
    setInfoWindowVisibility(true)
  }

  return (
    <div>
      <Polyline
        path={path}
        options={{
          strokeColor: routeColor,
          // strokeOpacity: 0,
          // icons: [
          //   {
          //     icon: lineSymbol,
          //     offset: "0",
          //     repeat: "20px",
          //   },
          // ],
        }}
        onMouseOver={(e) => openEdgeInfoWindow(e)}
        onMouseMove={(e) => openEdgeInfoWindow(e)}
        onMouseOut={() => setInfoWindowVisibility(false)}
      >
      </Polyline>

      {/* {showInfoWindow && <InfoWindow position={mousePosition}>
        <div style={{color: 'black'}}>
          <h1>{props.edge.from_location.name} to {props.edge.to_location.name}</h1>
          <h3>{props.edge.distance.toFixed(2)} miles</h3>
          { props.edge.disruptions.map((disruption, index) =>  {
                return <p key={props.edge.from_location.name + props.edge.to_location.name + disruption.title + index}> - {disruption.title}</p>
            })
            }
        </div>
      </InfoWindow>
      } */}
      {showInfoWindow && <InfoWindow position={mousePosition} options={{disableAutoPan: true}}>
        <div style={{color: 'black'}}>
          <h1>Name: {props.routeName}</h1>
          <h3>{totalDistance} miles</h3>
          
        </div>
      </InfoWindow>
      }
    </div>
  )
}

export default MapLine;