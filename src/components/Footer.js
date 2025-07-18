import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Link as MuiLink, IconButton, TextField, Button, InputAdornment, Switch, Tooltip } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube, WhatsApp, Email, Phone, LocationOn, Send, DarkMode, LightMode } from '@mui/icons-material';
import TikTokIcon from '@mui/icons-material/MusicNote'; // TikTok icon substitute
import CurrencyConverter from './CurrencyConverter';

function Footer({ darkMode, toggleDarkMode }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you would send the email to your backend/newsletter service
    setNewsletterMsg('Thank you for subscribing!');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterMsg(''), 4000);
  };

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 5,
        mt: 'auto',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: 'relative',
      }}
    >
      {/* Dark Mode Toggle */}
      <Box sx={{ position: 'absolute', top: 16, right: 24, zIndex: 2 }}>
        <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton color="inherit" onClick={toggleDarkMode} size="large">
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Box>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {/* Brand & About */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Solvo Tours and Safaris
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
              Your gateway to unforgettable African adventures. Explore, discover, and experience the wild with us!
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" href="https://facebook.com" target="_blank" size="small" aria-label="Facebook"><Facebook /></IconButton>
              <IconButton color="inherit" href="https://www.instagram.com/solvotoursandtravels/" target="_blank" size="small" aria-label="Instagram"><Instagram /></IconButton>
              <IconButton color="inherit" href="https://twitter.com" target="_blank" size="small" aria-label="Twitter"><Twitter /></IconButton>
              <IconButton color="inherit" href="https://wa.me/254741106404" target="_blank" size="small" aria-label="WhatsApp"><WhatsApp /></IconButton>
              <IconButton color="inherit" href="https://youtube.com" target="_blank" size="small" aria-label="YouTube"><YouTube /></IconButton>
              <IconButton color="inherit" href="https://www.tiktok.com/@solvotoursandsafaris" target="_blank" size="small" aria-label="TikTok"><TikTokIcon /></IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom>Quick Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <MuiLink href="/" color="inherit" underline="hover">Home</MuiLink>
              <MuiLink href="/destinations" color="inherit" underline="hover">Destinations</MuiLink>
              <MuiLink href="/safaris" color="inherit" underline="hover">Safaris</MuiLink>
              <MuiLink href="/about" color="inherit" underline="hover">About</MuiLink>
              <MuiLink href="/contact" color="inherit" underline="hover">Contact</MuiLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom>Contact Us</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                <a href="tel:+254741106404" style={{color: 'inherit', textDecoration: 'none'}} aria-label="Call +254 741 106 404">+254 741 106 404</a><br/>
                <a href="tel:+254790153077" style={{color: 'inherit', textDecoration: 'none'}} aria-label="Call +254 790 153 077">+254 790 153 077</a>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                <a href="mailto:solvotoursandsafaris@gmail.com" style={{color: 'inherit', textDecoration: 'none'}} aria-label="Email solvotoursandsafaris@gmail.com">solvotoursandsafaris@gmail.com</a>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                <a href="mailto:omaikomark1@gmail.com" style={{color: 'inherit', textDecoration: 'none'}} aria-label="Email omaikomark1@gmail.com">omaikomark1@gmail.com</a>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">Viewpark Towers 1st Floor Suite 8, Nairobi, Kenya</Typography>
            </Box>
          </Grid>

          {/* Newsletter Signup & Currency Converter */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>Subscribe to our Newsletter</Typography>
            <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                variant="filled"
                size="small"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button type="submit" color="secondary" variant="contained" size="small" sx={{ minWidth: 0, px: 1.5 }}>
                        <Send fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  sx: { bgcolor: 'white', borderRadius: 1, fontSize: 14 }
                }}
                sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                required
                type="email"
              />
            </Box>
            {newsletterMsg && (
              <Typography variant="caption" color="secondary.main">{newsletterMsg}</Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <CurrencyConverter compact />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', mt: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Solvo Tours and Safaris. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center">
            Follow us on social media: @SolvoToursAndSafaris.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 