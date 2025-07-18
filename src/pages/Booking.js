import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import api from '../services/api';

function Booking() {
  const { safariId } = useParams();
  const navigate = useNavigate();
  const [safari, setSafari] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: null,
    guests: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSafariDetails = async () => {
      try {
        const response = await api.getSafariById(safariId);
        setSafari(response.data);
      } catch (error) {
        console.error('Error fetching safari details:', error);
        setError('Error loading safari details');
      }
    };
    fetchSafariDetails();
  }, [safariId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createBooking({
        ...formData,
        safari: safariId,
        date: formData.date.toISOString().split('T')[0],
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setError('Error creating booking. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!safari) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Your Safari
        </Typography>
        <Typography variant="h6" gutterBottom>
          {safari.title} - ${safari.price} per person
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Booking successful! Redirecting to home page...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Safari Date"
                  value={formData.date}
                  onChange={(newValue) =>
                    setFormData((prev) => ({ ...prev, date: newValue }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Number of Guests"
                name="guests"
                type="number"
                value={formData.guests}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={success}
            >
              Confirm Booking
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default Booking; 