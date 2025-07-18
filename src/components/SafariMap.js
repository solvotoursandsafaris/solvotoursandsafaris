import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

// Real safari destinations with coordinates
const destinations = [
  {
    name: 'Masai Mara',
    position: { lat: -1.4931, lng: 35.1439 },
    photo: '/images/masai_mara.jpg',
    facts: 'Famous for the Great Migration and big cats.',
    bookingUrl: '/safaris/masai-mara',
  },
  {
    name: 'Amboseli',
    position: { lat: -2.6486, lng: 37.2605 },
    photo: '/images/amboseli.jpg',
    facts: 'Known for elephants and views of Mt. Kilimanjaro.',
    bookingUrl: '/safaris/amboseli',
  },
  {
    name: 'Serengeti',
    position: { lat: -2.3333, lng: 34.8333 },
    photo: '/images/serengeti.jpg',
    facts: 'Vast plains and annual wildebeest migration.',
    bookingUrl: '/safaris/serengeti',
  },
  {
    name: 'Bwindi',
    position: { lat: -1.0536, lng: 29.6578 },
    photo: '/images/bwindi-safari.jpg',
    facts: 'Home to mountain gorillas in Uganda.',
    bookingUrl: '/safaris/bwindi',
  },
  {
    name: 'Tsavo',
    position: { lat: -3.3333, lng: 38.4833 },
    photo: '/images/tsavo-adventure.jpg',
    facts: 'Kenya’s largest park, famous for red elephants.',
    bookingUrl: '/safaris/tsavo',
  },
  {
    name: 'Ngorongoro',
    position: { lat: -3.1611, lng: 35.5877 },
    photo: '/images/ngorongoro.jpg',
    facts: 'World’s largest intact volcanic caldera.',
    bookingUrl: '/safaris/ngorongoro',
  },
  // Add more as desired
];

const containerStyle = {
  width: '100%',
  height: '420px',
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  overflow: 'hidden',
};

const center = { lat: -2.5, lng: 35.5 }; // Centered on East Africa

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#f7fafc' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#333' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fff' }] },
  { featureType: 'water', stylers: [{ color: '#b3e5fc' }] },
  { featureType: 'landscape', stylers: [{ color: '#ffe0b2' }] },
  { featureType: 'poi.park', stylers: [{ color: '#c8e6c9' }] },
  { featureType: 'road', stylers: [{ color: '#fff3e0' }] },
];

export default function SafariMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Loaded from .env
  });
  const [selected, setSelected] = useState(null);

  const handleMarkerClick = useCallback((dest) => {
    setSelected(dest);
  }, []);
  const handleClose = () => setSelected(null);

  if (!isLoaded) return <Box sx={{ width: '100%', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</Box>;

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', my: 8, position: 'relative' }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3 }}>
        Explore Our Safari Destinations
      </Typography>
      <Box sx={containerStyle}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={6}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'greedy',
          }}
        >
          {destinations.map((dest, i) => (
            <Marker
              key={dest.name}
              position={dest.position}
              animation={window.google && window.google.maps ? window.google.maps.Animation.DROP : undefined}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                scaledSize: { width: 40, height: 40 },
              }}
              onClick={() => handleMarkerClick(dest)}
            />
          ))}
          {selected && (
            <InfoWindow
              position={selected.position}
              onCloseClick={handleClose}
            >
              <Box sx={{ p: 1, minWidth: 220, maxWidth: 300 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={selected.photo} alt={selected.name} sx={{ width: 48, height: 48, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>{selected.facts}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href={selected.bookingUrl}
                  sx={{ fontWeight: 600 }}
                  aria-label={`Book safari in ${selected.name}`}
                >
                  Book Now
                </Button>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
} 