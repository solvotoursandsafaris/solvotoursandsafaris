import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import { CheckCircle, Print, Email } from '@mui/icons-material';
import api from '../services/api';
import { useState } from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaypalIcon from '@mui/icons-material/AccountBalanceWallet'; // Placeholder for PayPal
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'; // Placeholder for M-Pesa
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChatIcon from '@mui/icons-material/Chat';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StarRateIcon from '@mui/icons-material/StarRate';

function BookingConfirmation() {
  const location = useLocation();
  const { booking, safari, paymentMethod, depositAmount } = location.state || {};
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handlePay = async (gateway) => {
    setPaying(true);
    setError(null);
    try {
      const payload = {
        amount: booking?.total_price,
        currency: 'USD',
        booking_id: booking?.id,
      };
      let res;
      if (gateway === 'stripe') {
        res = await api.initiateStripePayment(payload);
        window.location.href = res.data.checkout_url;
      } else if (gateway === 'intasend') {
        res = await api.initiateIntaSendPayment(payload);
        alert(res.data.message || 'IntaSend payment flow coming soon!');
      }
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
    }
    setPaying(false);
  };

  const handleChat = () => {
    // Open chat widget or redirect to chat page
    window.location.href = '/contact';
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, textAlign: 'center', position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.7s' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 1, animation: 'popIn 0.5s' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Thank you for booking with Solvo Tours and Safaris.
          </Typography>
        </Box>
        <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: '#f9f9f9', boxShadow: 1, textAlign: 'left' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Booking Summary
          </Typography>
          <Typography><b>Reference:</b> #{booking?.id}</Typography>
          <Typography><b>Name:</b> {booking?.name}</Typography>
          <Typography><b>Email:</b> {booking?.email}</Typography>
          <Typography><b>Phone:</b> {booking?.phone}</Typography>
          <Typography><b>Date:</b> {booking?.date}</Typography>
          <Typography><b>Guests:</b> {booking?.guests}</Typography>
          <Typography><b>Safari:</b> {safari?.title}</Typography>
          <Typography><b>Total Price:</b> ${booking?.total_price?.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            <b>What happens next?</b><br />
            Our team will contact you soon to confirm your booking and discuss payment options. If you have any questions, feel free to chat with us!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button variant="contained" color="primary" startIcon={<ChatIcon />} onClick={handleChat} sx={{ minWidth: 180 }}>
              Chat with Us
            </Button>
            <Button variant="outlined" color="primary" startIcon={<Print />} onClick={handlePrint} sx={{ minWidth: 180 }}>
              Print Booking
            </Button>
            <Button variant="contained" color="success" component={Link} to="/safaris" sx={{ minWidth: 180 }}>
              Browse More Safaris
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <VerifiedUserIcon color="success" />
            <Typography variant="body2">Secure Booking</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <SupportAgentIcon color="primary" />
            <Typography variant="body2">24/7 Support</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <StarRateIcon color="warning" />
            <Typography variant="body2">Verified Reviews</Typography>
          </Box>
        </Box>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
          @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        `}</style>
      </Paper>
    </Container>
  );
}

export default BookingConfirmation; 