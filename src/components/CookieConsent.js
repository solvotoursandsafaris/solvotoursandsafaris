import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 2,
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Typography variant="body2">
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. See our <a href="/cookie-policy" style={{ color: 'blue' }}>cookie policy</a>.
      </Typography>
      <Box>
        <Button variant="contained" onClick={handleAccept} sx={{ marginRight: 1 }}>
          Accept all
        </Button>
        <Button variant="outlined" onClick={handleReject}>
          Reject all
        </Button>
      </Box>
    </Box>
  );
};

export default CookieConsent;
