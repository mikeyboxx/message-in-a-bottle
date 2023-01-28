import {useState, useCallback} from 'react';
import {GoogleMap, Marker} from '@react-google-maps/api';
import {updateMarkerDistance} from '../../utils/generateRandomMarkers';

export default function MapContainer({distanceTravelled, randomMarkers, position }) {
  const [map, setMap] = useState(null);

  // google map options
  const mapOptions = {
    zoom: map?.zoom || 20,
    center: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    disableDefaultUI: true,
    mapId: '8dce6158aa71a36a',
    heading: position.coords.heading,
    tilt: 45
  }

  // user icon object
  const userIcon = {
    fillColor: '#4285F4',
    fillOpacity: 1,
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: 'rgb(255,255,255)',
    strokeWeight: 4,
  };

  // note icon object
  const noteIcon = {
    fillColor: "black",
    fillOpacity: .7,
    scale: .03,
    // bird
    path: "M160.8 96.5c14 17 31 30.9 49.5 42.2c25.9 15.8 53.7 25.9 77.7 31.6V138.8C265.8 108.5 250 71.5 248.6 28c-.4-11.3-7.5-21.5-18.4-24.4c-7.6-2-15.8-.2-21 5.8c-13.3 15.4-32.7 44.6-48.4 87.2zM320 144v30.6l0 0v1.3l0 0 0 32.1c-60.8-5.1-185-43.8-219.3-157.2C97.4 40 87.9 32 76.6 32c-7.9 0-15.3 3.9-18.8 11C46.8 65.9 32 112.1 32 176c0 116.9 80.1 180.5 118.4 202.8L11.8 416.6C6.7 418 2.6 421.8 .9 426.8s-.8 10.6 2.3 14.8C21.7 466.2 77.3 512 160 512c3.6 0 7.2-1.2 10-3.5L245.6 448H320c88.4 0 160-71.6 160-160V128l29.9-44.9c1.3-2 2.1-4.4 2.1-6.8c0-6.8-5.5-12.3-12.3-12.3H400c-44.2 0-80 35.8-80 80zm80 16c-8.8 0-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16z",
  }

  // set the map state variable to the instance of the google maps object
  const onLoad = useCallback(
    function onLoad(map){
      setMap(map); 
    },[])

  // for every marker, re-calculate distance and set the flag if within 3 meters of the user
  if(randomMarkers){
    randomMarkers = updateMarkerDistance(position.coords.latitude, position.coords.longitude, randomMarkers);
    
    randomMarkers = randomMarkers.map(el=> {
      el.inProximity = el.distance <= 20;
      return el;
    })
  }

  return (
    <>
      <GoogleMap
        options={mapOptions}
        mapContainerStyle={{ 
          height: '100vh', 
          width: '100%', 
          position: 'relative' 
        }}
        onLoad={onLoad}
      >

        <Marker
          position={{
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }}
          icon={userIcon}
        />

        {randomMarkers?.map((marker, idx) =>
          <Marker
            key={idx}
            position={marker.position}
            icon={{...noteIcon, fillColor: marker.inProximity ? "red" : "black"}}
          />
        )}

      </GoogleMap>

      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '300px',
          height: '300px',
          backgroundColor: 'black',
          opacity: .3,
          zIndex: 1,
          color: 'white',
          fontWeight: 'bold',
          overflow: 'auto'
        }}>
          
          <p style={{
            color: 'white',
            fontWeight: 'bold'
            }}
          >
            Distance travelled: {distanceTravelled.toFixed(3)} meters
          </p>

          <ul>
            {randomMarkers?.filter(marker => marker.inProximity === true)
              ?.map((el, idx)=> 
                <li key={idx}>
                    Note #: {idx + 1} <br/> Distance: {el.distance.toFixed(3)} meters <hr/> 
                </li>
              )
            }
          </ul>  
      </div>
    </>
  )
}