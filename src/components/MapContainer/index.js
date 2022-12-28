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
    // mapTypeId: 'hybrid',
    // zoomControl: false,
    mapId: '8dce6158aa71a36a',
    heading: heading,
    tilt: 45
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
                //astronaut
                path: "M370.7 96.1C346.1 39.5 289.7 0 224 0S101.9 39.5 77.3 96.1C60.9 97.5 48 111.2 48 128v64c0 16.8 12.9 30.5 29.3 31.9C101.9 280.5 158.3 320 224 320s122.1-39.5 146.7-96.1c16.4-1.4 29.3-15.1 29.3-31.9V128c0-16.8-12.9-30.5-29.3-31.9zM336 144v16c0 53-43 96-96 96H208c-53 0-96-43-96-96V144c0-26.5 21.5-48 48-48H288c26.5 0 48 21.5 48 48zM189.3 162.7l-6-21.2c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6zM112.7 316.5C46.7 342.6 0 407 0 482.3C0 498.7 13.3 512 29.7 512H128V448c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64l98.3 0c16.4 0 29.7-13.3 29.7-29.7c0-75.3-46.7-139.7-112.7-165.8C303.9 338.8 265.5 352 224 352s-79.9-13.2-111.3-35.5zM176 448c-8.8 0-16 7.2-16 16v48h32V464c0-8.8-7.2-16-16-16zm96 32c8.8 0 16-7.2 16-16s-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16z",
                //pointer
                // "M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z",
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