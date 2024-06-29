import React from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';

import './styles/SupplyChainRoutes.css'
import Disruption from '../models/Disruption';
import earthquakeIcon from '../assets/new-icons/EQ-edited.png';
import wildfireIcon from '../assets/new-icons/WF-edited.png';
import cycloneIcon from '../assets/new-icons/TC-edited.png';
import droughtIcon from '../assets/new-icons/DR-edited.png';
import floodIcon from '../assets/new-icons/FL-edited.png';
import volcanoIcon from '../assets/new-icons/VO-edited.png';
import unrestIcon from "../assets/new-icons/UR-edited.png"
import cyberIcon from "../assets/new-icons/Cyber-edited.png"
import naturalDisasterIcon from '../assets/new-icons/Default-edited.png';


function DisruptionMarker(props: { 'disruption': Disruption }) {

  const [showInfoWindow, setInfoWindowVisibility] = React.useState<boolean>(false); // Info window visibility
  const [disruptionIcon, setDisruptionIcon] = React.useState<any>(wildfireIcon); // Icon to display
  
  React.useEffect(() => {
    let disruptionType = props.disruption.type.toLowerCase();
    if (disruptionType === 'earthquake') {
      setDisruptionIcon(earthquakeIcon);
    } else if (disruptionType === 'wildfire') {
      setDisruptionIcon(wildfireIcon);
    } else if (disruptionType === 'cyclone') {
      setDisruptionIcon(cycloneIcon);
    } else if (disruptionType === 'drought') {
      setDisruptionIcon(droughtIcon);
    } else if (disruptionType === 'flood') {
      setDisruptionIcon(floodIcon);
    } else if (disruptionType === 'volcano') {
      setDisruptionIcon(volcanoIcon);
    } else if (disruptionType === 'unrest') {
      setDisruptionIcon(unrestIcon);
    } else if (disruptionType === 'cyber') {
      setDisruptionIcon(cyberIcon)
    } else {
      setDisruptionIcon(naturalDisasterIcon);
    }
  }, [props]);


  return (
    <Marker
      onMouseOver={() => setInfoWindowVisibility(true)}
      onMouseOut={() => setInfoWindowVisibility(false)}
      icon={{
        url: disruptionIcon,
      }}
      position={{
        lat: props.disruption.latitude,
        lng: props.disruption.longitude
      }}
    >

      {showInfoWindow &&
        <InfoWindow position={{
          lat: props.disruption.latitude,
          lng: props.disruption.longitude
        }} options={{disableAutoPan: true}}>
          <div style={{color: 'black'}}>
            <h1>{props.disruption.type[0].toUpperCase() + props.disruption.type.substring(1)}</h1>
            <h3>{props.disruption.title}</h3>
            <h3>Risk Score: {props.disruption.risk}</h3>
            <p>{props.disruption.description}</p>
          </div>
        </InfoWindow>
      }

    </Marker>

  )
}

export default DisruptionMarker;