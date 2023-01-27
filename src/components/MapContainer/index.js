import { useEffect, useState, useCallback } from 'react';
import {GoogleMap, Marker, InfoWindow} from '@react-google-maps/api';

export default function MapContainer({randomMarkers, position }) {
  const [map, setMap] = useState(null);

  const mapOptions = {
    zoom: map?.zoom || 18,
    center: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    disableDefaultUI: true,
    mapId: '8dce6158aa71a36a',
    heading: position.coords.heading,
    tilt: 45
  }


  const blueDot = {
    fillColor: '#4285F4',
    fillOpacity: 1,
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: 'rgb(255,255,255)',
    strokeWeight: 4,
  };

  const onLoad = useCallback(
    function onLoad(map){
      setMap(map); 
    },[])

  return (
    <>
      <GoogleMap
        options={mapOptions}
        mapContainerStyle={{ height: '100vh', width: '100%' }}
        onLoad={onLoad}
        // onZoomChanged={setZoom(map?.zoom)}
      >
          <Marker
            position={{
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }}
            icon={blueDot}
            // icon={{
            //   fillColor: "#4285F4",
            //   fillOpacity: 1,
            //   scale: .05,
            //   strokeColor: "rgb(255,255,255)",
            //   strokeWeight: 2,
            //   // rotation: position.coords.heading,
            //   //arrow
            //   path: "M160 256C160 202.1 202.1 160 256 160C309 160 352 202.1 352 256C352 309 309 352 256 352C202.1 352 160 309 160 256zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z",
            //   // path: "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z",
            //   // path: "M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm11.3-395.3l112 112c4.6 4.6 5.9 11.5 3.5 17.4s-8.3 9.9-14.8 9.9H304v96c0 17.7-14.3 32-32 32H240c-17.7 0-32-14.3-32-32V256H144c-6.5 0-12.3-3.9-14.8-9.9s-1.1-12.9 3.5-17.4l112-112c6.2-6.2 16.4-6.2 22.6 0z",
            // }}
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
            />
          )}
      </GoogleMap>
    </>
  )
}