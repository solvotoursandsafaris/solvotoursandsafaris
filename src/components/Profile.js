import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box, Chip, Tooltip, Avatar } from '@mui/material';
import api from '../services/api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExploreIcon from '@mui/icons-material/Explore';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(profile);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4">User Profile</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={profile.username}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        {/* Add more fields as necessary */}
        <Button type="submit" variant="contained" color="primary">Update Profile</Button>
      </form>
      {/* Badges & Achievements Section */}
      <Box sx={{ mt: 5, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Badges & Achievements
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* First Booking Badge */}
          {profile && profile.bookings && profile.bookings.length > 0 && (
            <Tooltip title="First Booking! Enjoy a 5% discount on your next trip." arrow>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'gold' }}><EmojiEventsIcon sx={{ color: '#fff' }} /></Avatar>}
                label="First Booking"
                color="warning"
                sx={{ fontWeight: 600, fontSize: 16 }}
              />
            </Tooltip>
          )}
          {/* Explorer Badge */}
          {profile && profile.bookings && profile.bookings.length >= 3 && (
            <Tooltip title="Explorer! Free room upgrade on your next safari." arrow>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'green' }}><ExploreIcon sx={{ color: '#fff' }} /></Avatar>}
                label="Explorer"
                color="success"
                sx={{ fontWeight: 600, fontSize: 16 }}
              />
            </Tooltip>
          )}
          {/* Early Bird Badge */}
          {profile && profile.bookings && profile.bookings.some(b => b.early) && (
            <Tooltip title="Early Bird! Enjoy a free breakfast on your next trip." arrow>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'skyblue' }}><AccessTimeIcon sx={{ color: '#fff' }} /></Avatar>}
                label="Early Bird"
                color="info"
                sx={{ fontWeight: 600, fontSize: 16 }}
              />
            </Tooltip>
          )}
          {/* No badges yet */}
          {profile && (!profile.bookings || profile.bookings.length === 0) && (
            <Typography variant="body1" color="text.secondary">No badges yet. Book a safari to earn your first badge!</Typography>
          )}
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
