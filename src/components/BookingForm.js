import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Person, Phone, Email, MedicalServices } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import PaypalIcon from '@mui/icons-material/AccountBalanceWallet'; // Placeholder for PayPal
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'; // Placeholder for M-Pesa
import axios from 'axios';

function BookingForm({ safari, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: null,
    guests: 1,
    specialRequirements: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceOptions: '',
    specialDietaryRequirements: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleProofFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedDate = formData.date ? dayjs(formData.date).format('YYYY-MM-DD') : null;
      
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formattedDate,
        guests: parseInt(formData.guests),
        special_requirements: formData.specialRequirements || '',
        emergency_contact_name: formData.emergencyContactName || '',
        emergency_contact_phone: formData.emergencyContactPhone || '',
        insurance_options: formData.insuranceOptions ? JSON.parse(formData.insuranceOptions) : {},
        special_dietary_requirements: formData.specialDietaryRequirements || '',
        safari: parseInt(safari.id),
        status: 'pending',
        total_price: parseFloat((safari.price * formData.guests).toFixed(2)),
      };

      let response;
      if (proofFile) {
        const form = new FormData();
        Object.entries(bookingData).forEach(([k, v]) => form.append(k, v));
        form.append('proof_of_payment', proofFile);
        response = await api.createBooking(form, true);
      } else {
        response = await api.createBooking(bookingData);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Booking submitted successfully! We will contact you to confirm your safari and discuss payment options.',
        severity: 'success',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: null,
        guests: 1,
        specialRequirements: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        insuranceOptions: '',
        specialDietaryRequirements: '',
      });
      setProofFile(null); // Clear proof file

      // Wait for 2 seconds to show the success message before redirecting
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(response);
        }
        // Always redirect to confirmation page
        navigate('/booking-confirmation', {
          state: {
            booking: response,
            safari: safari,
          },
        });
      }, 1000);

    } catch (error) {
      console.error('Booking error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || error.response?.data?.message || 'Error submitting booking. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Book Your Safari
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary">
            {safari.title}
          </Typography>
          <Typography variant="subtitle1">
            Duration: {safari.duration} days
          </Typography>
          <Typography variant="h6" color="primary">
            ${safari.price} per person
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} encType={proofFile ? 'multipart/form-data' : undefined}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Safari Date"
                value={formData.date}
                onChange={(newValue) => handleDateChange(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                minDate={dayjs()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Number of Guests</InputLabel>
                <Select
                  value={formData.guests}
                  label="Number of Guests"
                  name="guests"
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color="primary">
                Total: ${(safari.price * formData.guests).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <b>Pay a 40% deposit (${safari.price * formData.guests * 0.4}) to confirm your booking.</b> The balance will be paid on arrival.<br />
                Choose your preferred payment method below.
              </Alert>
            </Grid>
            {proofFile && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Please transfer the full amount to <b>Account Number: 098989083</b> and upload your payment proof below.<br />
                  Your booking will be confirmed after admin verifies your payment.
                </Alert>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2 }}
                >
                  Upload Proof of Payment
                  <input type="file" hidden onChange={handleProofFileChange} accept="image/*,application/pdf" />
                </Button>
                {proofFile && <Typography variant="body2" sx={{ mt: 1 }}>{proofFile.name}</Typography>}
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Insurance Options (JSON)"
                name="insuranceOptions"
                value={formData.insuranceOptions}
                onChange={handleChange}
                placeholder={`e.g., {"provider": "TravelGuard", "policy_number": "ABC123"}`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Special Dietary Requirements"
                name="specialDietaryRequirements"
                value={formData.specialDietaryRequirements}
                onChange={handleChange}
                placeholder="e.g., Vegetarian, Gluten-free, Allergies (nuts)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Other Special Requirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any other preferences or special requests..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={<PaymentIcon />}
              >
                {loading ? 'Submitting...' : `Book Now`}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default BookingForm; 