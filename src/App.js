import { useEffect, useState} from 'react';
import {useLoadScript} from '@react-google-maps/api';
import './App.css';
import MapContainer from './components/MapContainer';
import generateRandomMarkers from './utils/generateRandomMarkers';


function App() {
  const [position, setPosition] = useState(null);
  const [randomMarkers, setRandomMarkers] = useState(null);
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  
  // first time get current gps position
  useEffect(()=>{
    // navigator.geolocation.getCurrentPosition(
    navigator.geolocation.watchPosition(
      pos => {
        // setPosition({
        //   lat: pos.coords.latitude,
        //   lng: pos.coords.longitude
        // });
        setPosition(pos);
        console.log(pos);
        
      },
      // need to handle err in html
      err => console.log(err),
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
      }
    );
  },[]);

  useEffect(()=>{
    // navigator.geolocation.getCurrentPosition(
    if (!randomMarkers && position) {
      const arr = generateRandomMarkers(position.coords.latitude, position.coords.longitude, 100);
      setRandomMarkers(arr);
    }
  },[randomMarkers, position]);

  return (
      <div>
        {(!position || !isLoaded) && 'Loading...'}

        {loadError && 'Error Loading Google Maps!'}

        {position && isLoaded && 
          <MapContainer 
            randomMarkers={randomMarkers} 
            position={position} />}
      </div>
  );
}

export default App;
