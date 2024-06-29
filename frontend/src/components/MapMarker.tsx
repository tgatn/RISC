import React from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';

import Location from '../models/Location';
import './styles/SupplyChainRoutes.css'
import LocationType from '../models/LocationType';

function MapMarker(props: { 'location': Location, 'locationTypes': LocationType[] }) {

  const [showInfoWindow, setInfoWindowVisibility] = React.useState<boolean>(false); // Info window visibility

  
  /**
   * Gets the location type associated with the location based on ID
   * @returns Location Type name
   */
  const getLocationType = () => {
    const type = props.locationTypes.find(lt => lt._id === props.location.type); // Find Location type attached to Location
    return type?.type
  }


  return (
    <Marker
      onMouseOver={() => setInfoWindowVisibility(true)}
      onMouseOut={() => setInfoWindowVisibility(false)}
      position={{
        lat: props.location.latitude,
        lng: props.location.longitude
      }}
    >

      {showInfoWindow &&
        <InfoWindow position={{
          lat: props.location.latitude,
          lng: props.location.longitude
        }} options={{disableAutoPan: true}}>
          <div style={{color: 'black'}}>
            <h1>{props.location.name}</h1>
            <h3>{getLocationType()}</h3>
            <p><span className='bold'>Street:</span> {props.location.address}</p>
            <p><span className='bold'>City:</span> {props.location.city}</p>
            <p><span className='bold'>Country:</span> {props.location.country}</p>
            { props.location.disruptions.map((disruption, index) =>  {
                return <p key={props.location.name + disruption.title + index}> - {disruption.title}</p>
            })
            }
          </div>
        </InfoWindow>
      }

    </Marker>

  )
}

export default MapMarker;
