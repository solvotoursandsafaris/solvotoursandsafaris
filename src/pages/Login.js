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
  InputAdornment,
  IconButton,
  Card,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('User Data:', credentials);
    try {
      const response = await api.login(credentials);
      // Store tokens in local storage or context
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', credentials.username);
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data);
      setSnackbar({ open: true, message: 'Login failed. Please check your credentials.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ mt: 10, mb: 6, p: 4, borderRadius: 4, boxShadow: 6, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
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
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, py: 1.5, mt: 1 }}>
                  Login
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
      {/* Only one Footer at the bottom */}
    </Box>
  );
}

export default Login; 