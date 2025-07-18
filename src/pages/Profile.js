// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { Box, Paper, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../services/api';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [preferencesString, setPreferencesString] = useState('');

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

  useEffect(() => {
    if (profile && profile.image) {
      setImagePreview(profile.image);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && profile.preferences) {
      if (typeof profile.preferences === 'string') {
        setPreferencesString(profile.preferences);
      } else if (Array.isArray(profile.preferences)) {
        setPreferencesString(profile.preferences.join(', '));
      } else if (typeof profile.preferences === 'object') {
        setPreferencesString(Object.values(profile.preferences).join(', '));
      } else {
        setPreferencesString('');
      }
    } else {
      setPreferencesString('');
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleTogglePassword = () => setShowPassword((show) => !show);
  const handleToggleConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handlePreferencesChange = (e) => {
    setPreferencesString(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }
    try {
      // Only send allowed fields
      const updateData = {};
      updateData.preferences = preferencesString.split(',').map(s => s.trim()).filter(Boolean);
      if (form.password) updateData.password = form.password;
      if (profile.loyalty_points !== undefined) updateData.loyalty_points = profile.loyalty_points;
      let formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (key === 'preferences') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (image) formData.append('image', image);
      await api.updateProfile(formData, true); // true = multipart
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setForm({ password: '', confirmPassword: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Edit Profile</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar src={imagePreview} sx={{ width: 90, height: 90, mb: 1 }} />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image-upload">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Preferences"
                name="preferences"
                value={preferencesString}
                onChange={handlePreferencesChange}
                fullWidth
                margin="normal"
                placeholder="e.g. Beach, Adventure, Family, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handlePasswordChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <Button onClick={handleTogglePassword} tabIndex={-1}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <Button onClick={handleToggleConfirmPassword} tabIndex={-1}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" size="large">Update Profile</Button>
          </Box>
        </form>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Profile;