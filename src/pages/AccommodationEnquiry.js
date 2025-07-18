import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Skeleton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import api from '../services/api';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import PaypalIcon from '@mui/icons-material/AccountBalanceWallet'; // Placeholder for PayPal
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'; // Placeholder for M-Pesa
import axios from 'axios';

const howDidYouHearOptions = [
  'Google Search',
  'Social Media',
  'Friend/Family',
  'Travel Agent',
  'Other'
];

const AccommodationEnquiry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    checkin: null,
    checkout: null,
    guests: 1,
    special: '',
    heard: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [accommodation, setAccommodation] = useState(null);
  const [accommodationLoading, setAccommodationLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaPromptOpen, setMpesaPromptOpen] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState('');

  useEffect(() => {
    setAccommodationLoading(true);
    fetch(`/api/accommodations/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setAccommodation(data);
        setAccommodationLoading(false);
      })
      .catch(() => setAccommodationLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/accommodation-enquiry/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          accommodation: id,
          message: `Check-in: ${form.checkin ? dayjs(form.checkin).format('YYYY-MM-DD') : ''}\nCheck-out: ${form.checkout ? dayjs(form.checkout).format('YYYY-MM-DD') : ''}\nGuests: ${form.guests}\nSpecial Requests: ${form.special}\nHow did you hear about us: ${form.heard}`
        })
      });
      if (res.ok) {
        setSuccess('Thank you for your interest! Our team will contact you soon to help you book your stay.');
        setForm({ name: '', email: '', phone: '', checkin: null, checkout: null, guests: 1, special: '', heard: '' });
        setShowPayment(true);
        // setTimeout(() => navigate('/dashboard'), 1200); // Remove auto-redirect
      } else {
        const data = await res.json();
        setError(data.detail || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handlePay = async (amount, accommodationId) => {
    try {
      if (paymentMethod === 'card') {
        const res = await axios.post('/api/pay/card/', {
          amount,
          currency: 'USD',
          accommodation_enquiry_id: accommodationId,
        });
        window.location.href = res.data.checkout_url;
      } else if (paymentMethod === 'paypal') {
        const res = await axios.post('/api/pay/paypal/', {
          amount,
          currency: 'USD',
          accommodation_enquiry_id: accommodationId,
        });
        window.location.href = res.data.checkout_url;
      } else if (paymentMethod === 'mpesa') {
        setMpesaPromptOpen(true);
      }
    } catch (err) {
      setPaymentError('Failed to initiate payment. Please try again.');
    }
  };

  const handleMpesaPay = async (amount, accommodationId) => {
    setMpesaStatus('');
    try {
      const res = await axios.post('/api/pay/mpesa/', {
        amount,
        phone: mpesaPhone,
        accommodation_enquiry_id: accommodationId,
      });
      setMpesaStatus(res.data.ResponseDescription || 'M-Pesa prompt sent. Complete payment on your phone.');
    } catch (err) {
      setMpesaStatus('Failed to initiate M-Pesa payment.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
          Book Your Stay with Solvo
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Let us handle your hotel booking! Fill out the form and our travel experts will secure your perfect stay.
        </Typography>
        {/* Accommodation Summary Card */}
        {accommodationLoading ? (
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 3 }} />
        ) : accommodation ? (
          <Card sx={{ display: 'flex', mb: 3, boxShadow: 2, borderRadius: 2 }}>
            <CardMedia
              component="img"
              image={accommodation.image}
              alt={accommodation.name}
              sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2, m: 2 }}
            />
            <CardContent sx={{ flex: 1, p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{accommodation.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{accommodation.location}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip label={accommodation.type?.charAt(0).toUpperCase() + accommodation.type?.slice(1)} color="primary" size="small" />
                <Chip label={`${accommodation.rating} ★`} color="secondary" size="small" />
              </Box>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                ${accommodation.price_per_night} / night
              </Typography>
            </CardContent>
          </Card>
        ) : null}
        <Divider sx={{ mb: 3 }} />
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Check-in Date"
                  value={form.checkin}
                  onChange={(val) => handleDateChange('checkin', val)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Check-out Date"
                  value={form.checkout}
                  onChange={(val) => handleDateChange('checkout', val)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Number of Guests"
                name="guests"
                type="number"
                value={form.guests}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1, max: 20 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Requests (optional)"
                name="special"
                value={form.special}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>How did you hear about us?</InputLabel>
                <Select
                  name="heard"
                  value={form.heard}
                  label="How did you hear about us?"
                  onChange={handleChange}
                >
                  {howDidYouHearOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ fontWeight: 600, fontSize: '1.1rem', py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Booking Enquiry'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        {showPayment && accommodation && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <b>Full payment is required online to reserve your accommodation.</b> Your reservation will only be confirmed after payment is received.<br />
              Choose your preferred payment method below.
            </Alert>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                label="Payment Method"
                onChange={e => setPaymentMethod(e.target.value)}
                name="payment_method"
              >
                <MenuItem value="card"><CreditCardIcon sx={{ mr: 1 }} />Bank Card (VISA, Mastercard, Amex)</MenuItem>
                <MenuItem value="paypal"><PaypalIcon sx={{ mr: 1 }} />PayPal</MenuItem>
                <MenuItem value="mpesa"><PhoneIphoneIcon sx={{ mr: 1 }} />M-Pesa</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="success" startIcon={<PaymentIcon />} disabled={paying} onClick={() => handlePay(accommodation.price_per_night * form.guests, accommodation.id)}>
              Pay Now
            </Button>
            {/* M-Pesa Prompt Dialog */}
            {mpesaPromptOpen && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">Enter your M-Pesa phone number to receive a payment prompt:</Alert>
                <TextField
                  label="M-Pesa Phone Number"
                  value={mpesaPhone}
                  onChange={e => setMpesaPhone(e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() => handleMpesaPay(accommodation.price_per_night * form.guests, accommodation.id)}
                >
                  Pay with M-Pesa
                </Button>
                {mpesaStatus && <Alert sx={{ mt: 2 }}>{mpesaStatus}</Alert>}
              </Box>
            )}
            {paymentError && <Typography color="error" align="center" sx={{ mt: 2 }}>{paymentError}</Typography>}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AccommodationEnquiry; 