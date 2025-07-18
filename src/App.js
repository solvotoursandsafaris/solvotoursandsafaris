import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Safaris from './pages/Safaris';
import SafariDetail from './pages/SafariDetail';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import Accommodations from './pages/Accommodations';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { ThemeProvider } from '@mui/material';
import getTheme from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Chatbot from './components/Chatbot';
import CookieConsent from './components/CookieConsent';
import DestinationDetail from './pages/DestinationDetail';
import Footer from './components/Footer';
import AccommodationDetail from './pages/AccommodationDetail';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Zoom } from '@mui/material';
import AccommodationEnquiry from './pages/AccommodationEnquiry';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import Mascot from './components/Mascot';

function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/safaris" element={<Safaris />} />
            <Route path="/safaris/:id" element={<SafariDetail />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/accommodations/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/:id/enquire" element={<AccommodationEnquiry />} />
            <Route path="/booking/:safariId" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<Profile />} />
          </Routes>
          <Chatbot />
          <CookieConsent />
          <Mascot />
          <Footer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Zoom in={showScroll}>
            <Fab
              color="primary"
              size="medium"
              onClick={handleScrollTop}
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1200,
                boxShadow: 4
              }}
              aria-label="scroll back to top"
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Zoom>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 