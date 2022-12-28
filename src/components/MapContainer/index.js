import { useEffect, useState, useCallback } from 'react';
import {useLoadScript, GoogleMap, Marker, Icon} from '@react-google-maps/api';


export default function MapContainer() {
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const initialZoom = 18;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // mapIds: ['8dce6158aa71a36a']
    // v: 'beta'
  });

  const onLoad = useCallback(
    function onLoad(map){
      setMap(map); 
    }
  )

  useEffect(()=>{
    navigator.geolocation.watchPosition(
      position => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setHeading(position.coords.heading);
        console.log(position.coords);
      },
      error => {
        console.log(error);
        setError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      });
  },[]);

  const mapOptions = {
    zoom: initialZoom,
    center: position,
    disableDefaultUI: true,
    // zoomControl: false,
    mapId: '8dce6158aa71a36a',
    heading: heading,
  }
  
  return (
    <>
      {error && 
        <div>Error in obtaining current location. message: ${error.message}</div>}  

      {loadError && 
        <div>Map cannot be loaded right now, sorry.</div>}  
      
      {(!isLoaded || !position) && 
        <h2>Loading...</h2>}
      
      {(isLoaded && position) && 
        <GoogleMap
          onLoad={onLoad}
          options={mapOptions}
          mapContainerStyle={{ height: '100vh', width: '100%' }} 
          // zoom={initialZoom}
          // onLoad={map => {
          //   setMap(map); 
          //   // map.disableDefaultUI = true;
          // }}
          // center={position}
          
          // // mapTypeId={'hybrid'}
          // heading={90}
          // tilt={0}
          // zoomControl={false}
        >
            <Marker
              position={position}
              // rotation={20}
              icon={{
                path: "M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z",
                  // "M8 12l-4.7023 2.4721.898-5.236L.3916 5.5279l5.2574-.764L8 0l2.3511 4.764 5.2574.7639-3.8043 3.7082.898 5.236z",
                fillColor: "black",
                fillOpacity: 0.9,
                scale: .06,
                // scaledSize: {height: 
                // rotation: 80,
                rotation: heading,
                // strokeWeight: 6,
              }}
            />
            
            
        </GoogleMap>} 
    </>
    
  )
}