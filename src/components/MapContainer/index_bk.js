import { useEffect, useState, useCallback } from 'react';
import {useLoadScript, GoogleMap, Marker, InfoWindow} from '@react-google-maps/api';
import generateRandomMarkers, {updateMarkerDistance} from '../../utils/generateRandomMarkers';


export default function MapContainer() {
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(null);
  const [randomMarkers, setRandomMarkers] = useState(null);
  const [currentClickedMarker, setCurrentClickedMarker] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const initialZoom = 18;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  
  useEffect(()=>{
    console.log('useEffect');
    console.log(position, heading, randomMarkers);
    let arr = [];
    if (position){
      if (!randomMarkers) {
        console.log('generate');
        arr = generateRandomMarkers(position.lat, position.lng, 100);
        setRandomMarkers(arr);
      }
      // } else {
      //   console.log('update');
      //   arr = updateMarkerDistance(position.lat, position.lng, randomMarkers);
      //   setRandomMarkers(arr);
      // }
    }
  },[position, heading, randomMarkers]);

  const clickHandler = (e) => {
    e.preventDefault();
    console.log('click');

    navigator.geolocation.watchPosition(
      pos => {
        console.log('watchPosition');
        // console.log(pos.coords);
        console.log(randomMarkers, position, heading);
   
        if (randomMarkers) {
          const arr = updateMarkerDistance(pos.coords.latitude, pos.coords.longitude, randomMarkers);
          setRandomMarkers(arr);
          console.log('update', arr);
        }

        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setHeading(pos.coords.heading);
      },
      error => {
        console.log(error);
        setError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: Infinity
      }
    )
  }

  const onLoad = useCallback(
    function onLoad(map){
      setMap(map); 
    },[])

  const mapOptions = {
    zoom: initialZoom,
    center: position,
    disableDefaultUI: true,
    mapId: '8dce6158aa71a36a',
    heading: heading,
    tilt: 45
    // mapTypeId: 'hybrid',
    // zoomControl: false,
  }

  return (
    <>
      {(!position ) && 
          <button style={{height: 200, width: '50%', margin: 300}} onClick={clickHandler}>
              Start Game
          </button> } 

      {error && 
        <div>Error in obtaining current location. ${error.message}</div>}  

      {loadError && 
        <div>Map cannot be loaded right now, sorry.</div>}  
      
      {(!map && position) && 
        <h2>Loading Google Maps...</h2>}
      
      {(isLoaded && position) && 
        <GoogleMap
          onLoad={onLoad}
          
          options={mapOptions}
          mapContainerStyle={{ height: '100vh', width: '100%' }} 
        >
            <Marker
              position={position}
              icon={{
                fillColor: "black",
                fillOpacity: .7,
                scale: .05,
                rotation: heading,
                //astronaut
                path: "M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm11.3-395.3l112 112c4.6 4.6 5.9 11.5 3.5 17.4s-8.3 9.9-14.8 9.9H304v96c0 17.7-14.3 32-32 32H240c-17.7 0-32-14.3-32-32V256H144c-6.5 0-12.3-3.9-14.8-9.9s-1.1-12.9 3.5-17.4l112-112c6.2-6.2 16.4-6.2 22.6 0z",
                // path: "M370.7 96.1C346.1 39.5 289.7 0 224 0S101.9 39.5 77.3 96.1C60.9 97.5 48 111.2 48 128v64c0 16.8 12.9 30.5 29.3 31.9C101.9 280.5 158.3 320 224 320s122.1-39.5 146.7-96.1c16.4-1.4 29.3-15.1 29.3-31.9V128c0-16.8-12.9-30.5-29.3-31.9zM336 144v16c0 53-43 96-96 96H208c-53 0-96-43-96-96V144c0-26.5 21.5-48 48-48H288c26.5 0 48 21.5 48 48zM189.3 162.7l-6-21.2c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6zM112.7 316.5C46.7 342.6 0 407 0 482.3C0 498.7 13.3 512 29.7 512H128V448c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64l98.3 0c16.4 0 29.7-13.3 29.7-29.7c0-75.3-46.7-139.7-112.7-165.8C303.9 338.8 265.5 352 224 352s-79.9-13.2-111.3-35.5zM176 448c-8.8 0-16 7.2-16 16v48h32V464c0-8.8-7.2-16-16-16zm96 32c8.8 0 16-7.2 16-16s-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16z",
              }}

            
              onClick={()=>{
                setCurrentClickedMarker({
                  position,
                  distance: 0
                })
              }}   
            />

            {randomMarkers?.map((marker, idx) =>
              <Marker
                key={idx}
                position={marker.position}
                icon={{
                  fillColor: "black",
                  fillOpacity: .7,
                  scale: .03,
                  // bird
                  path: "M160.8 96.5c14 17 31 30.9 49.5 42.2c25.9 15.8 53.7 25.9 77.7 31.6V138.8C265.8 108.5 250 71.5 248.6 28c-.4-11.3-7.5-21.5-18.4-24.4c-7.6-2-15.8-.2-21 5.8c-13.3 15.4-32.7 44.6-48.4 87.2zM320 144v30.6l0 0v1.3l0 0 0 32.1c-60.8-5.1-185-43.8-219.3-157.2C97.4 40 87.9 32 76.6 32c-7.9 0-15.3 3.9-18.8 11C46.8 65.9 32 112.1 32 176c0 116.9 80.1 180.5 118.4 202.8L11.8 416.6C6.7 418 2.6 421.8 .9 426.8s-.8 10.6 2.3 14.8C21.7 466.2 77.3 512 160 512c3.6 0 7.2-1.2 10-3.5L245.6 448H320c88.4 0 160-71.6 160-160V128l29.9-44.9c1.3-2 2.1-4.4 2.1-6.8c0-6.8-5.5-12.3-12.3-12.3H400c-44.2 0-80 35.8-80 80zm80 16c-8.8 0-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16z",
                }}
                onClick={()=>{
                  setCurrentClickedMarker(marker)
                }} 
              />
            )}

            {currentClickedMarker &&
              <InfoWindow
                position={currentClickedMarker.position}
                onCloseClick={()=>{
                  setCurrentClickedMarker(null)
                }}
              >
                <div>
                  <h4>Latitude: {currentClickedMarker.position.lat.toFixed(6)}</h4>
                  <h4>Longitude: {currentClickedMarker.position.lng.toFixed(6)}</h4>
                  <h4>Distance: {currentClickedMarker.distance.toFixed(6)} Meters</h4>
                </div>
              </InfoWindow>
            } 
        </GoogleMap>} 
    </>
  )
}