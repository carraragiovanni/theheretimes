import React, { useCallback, useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Settings2Icon, MapPinIcon } from 'lucide-react';
import { Filters } from './components/Filters';
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
  selectedCity,
  onFilterChange,
  onBoundsChange
}) {
  const [showFilters, setShowFilters] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const [idleTimeoutId, setIdleTimeoutId] = useState(null);
  const {
    isLoaded
  } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBmuMv7QAjLewC28ThCE9KS89ZigDe4s9Q'
  });
  useEffect(() => {
    if (mapBounds) {
      onBoundsChange(mapBounds);
    }
  }, [mapBounds, onBoundsChange]);
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
  const onIdle = useCallback(() => {
    if (mapRef.current) {
      if (idleTimeoutId) {
        clearTimeout(idleTimeoutId);
      }
      const timeoutId = setTimeout(() => {
        const bounds = mapRef.current.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const newBounds = {
            ne: {
              lat: ne.lat(),
              lng: ne.lng()
            },
            sw: {
              lat: sw.lat(),
              lng: sw.lng()
            }
          };
          setMapBounds(newBounds);
          const visibleCities = cities.filter(city => {
            return city.lat <= ne.lat() && city.lat >= sw.lat() && city.lng <= ne.lng() && city.lng >= sw.lng();
          });
          if (visibleCities.length > 0 && !selectedCity) {
            onCityClick(visibleCities[0]);
          }
        }
      }, 500);
      setIdleTimeoutId(timeoutId);
    }
  }, [cities, onCityClick, idleTimeoutId, selectedCity]);
  if (!isLoaded) return <div>Loading...</div>;
  return <div className="relative h-full w-full">
      <style jsx global>{`
        .gmnoprint a,
        .gmnoprint span,
        .gm-style-cc {
          display: none !important;
        }
        .gmnoprint div {
          background: none !important;
        }
        .gm-style-cc {
          display: none !important;
        }
        .gm-control-active,
        .gm-svpc,
        .gm-style-mtc,
        .gm-fullscreen-control {
          display: none !important;
        }
        .gm-bundled-control,
        .gm-bundled-control-on-bottom {
          display: none !important;
        }
      `}</style>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={4} onLoad={onLoad} onUnmount={onUnmount} onIdle={onIdle} options={{
      styles: [{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      scaleControl: false,
      rotateControl: false,
      panControl: false
    }}>
        {cities.map(city => <Marker key={city.id} position={{
        lat: city.lat,
        lng: city.lng
      }} onClick={() => onCityClick(city)} title={`${city.name} - Population: ${city.population.toLocaleString()}`} />)}
      </GoogleMap>
      <button onClick={handleLocateMe} className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors" aria-label="Find my location">
        <MapPinIcon className="w-6 h-6 text-blue-600" />
      </button>
      <button onClick={() => setShowFilters(!showFilters)} className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10" aria-label="Toggle filters">
        <Settings2Icon className="w-6 h-6 text-gray-600" />
      </button>
      {showFilters && <div className="absolute bottom-4 left-4 z-10">
          <Filters onFilterChange={onFilterChange} />
        </div>}
    </div>;
}