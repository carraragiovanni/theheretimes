import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};
const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795
};
export function Map({
  cities,
  onCityClick,
  selectedCity
}) {
  const {
    isLoaded
  } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBmuMv7QAjLewC28ThCE9KS89ZigDe4s9Q' // You'll need to replace this with a real API key
  });
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (mapRef.current) {
          mapRef.current.panTo(pos);
          mapRef.current.setZoom(10);
        }
      });
    }
  };
  const mapRef = useRef(null);
  const onLoad = useCallback(map => {
    mapRef.current = map;
  }, []);
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  if (!isLoaded) return <div>Loading...</div>;
  return <div className="relative h-full w-full">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={4} onLoad={onLoad} onUnmount={onUnmount} options={{
      styles: [{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }}>
        {cities.map(city => <Marker key={city.id} position={{
        lat: city.lat,
        lng: city.lng
      }} onClick={() => onCityClick(city)} title={`${city.name} - Population: ${city.population.toLocaleString()}`} />)}
      </GoogleMap>
      <button onClick={handleLocateMe} className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors" aria-label="Find my location">
        <div className="w-6 h-6 text-blue-600" />
      </button>
    </div>;
}