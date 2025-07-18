import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  Card,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../services/api';
import axios from 'axios';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', first_name: '', last_name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setSnackbar({ open: true, message: 'Password must be at least 8 characters long.', severity: 'error' });
      return;
    }
    if (!isPasswordStrong(form.password)) {
      setSnackbar({ open: true, message: 'Password must include uppercase, lowercase, numbers, and special characters.', severity: 'error' });
      return;
    }

    try {
      await api.register({
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      });
      setSnackbar({ open: true, message: 'Registration successful! You can now log in.', severity: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Wait 1.5 seconds before redirecting
    } catch (err) {
      setError('Sign up failed. Please try again.');
      setSnackbar({ open: true, message: err.response?.data?.detail || 'Registration failed. Please try again.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ mt: 10, mb: 6, p: 4, borderRadius: 4, boxShadow: 6, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
            <PersonAddAlt1Icon fontSize="large" />
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={form.username}
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
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {error && <Grid item xs={12}><Typography color="error" sx={{ mt: 1 }}>{error}</Typography></Grid>}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, py: 1.5, mt: 1 }}>
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Signup; 