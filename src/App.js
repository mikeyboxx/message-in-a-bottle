import { useEffect, useState} from 'react';
import {useLoadScript} from '@react-google-maps/api';
import './App.css';
import MapContainer from './components/MapContainer';
import generateRandomMarkers, {getDistanceFromLatLonInMeters} from './utils/generateRandomMarkers';


function App() {
  const [position, setPosition] = useState(null);
  const [randomMarkers, setRandomMarkers] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // first time get current gps position
  useEffect(()=>{
    navigator.geolocation.watchPosition(
      pos => {
        setPosition(oldPos=>{
          const dist = getDistanceFromLatLonInMeters(oldPos?.coords.latitude, oldPos?.coords.longitude, pos.coords.latitude, pos.coords.longitude) || 0;
          setDistanceTravelled(oldDistanceTravelled => oldDistanceTravelled + dist);
          return pos;
        });
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

  // generate random markers only once. the very first time, but wait first until gps position is aquired
  useEffect(()=>{
    // navigator.geolocation.getCurrentPosition(
    if (!randomMarkers && position) {
      // generate random markers in a 100 feet radius from user's position
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
            distanceTravelled={distanceTravelled}
            randomMarkers={randomMarkers} 
            position={position} />}
      </div>
  );
}

export default App;
