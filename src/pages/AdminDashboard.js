import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit, Email, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../services/api';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.updateBooking(bookingId, { status: newStatus });
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ref #</TableCell>
              <TableCell>Safari</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>#{booking.id}</TableCell>
                <TableCell>{booking.safari.title}</TableCell>
                <TableCell>
                  <Typography variant="body2">{booking.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {booking.email}
                  </Typography>
                </TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.guests}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>${booking.total_price}</TableCell>
                <TableCell>
                  <Box>
                    <IconButton
                      color="success"
                      onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    >
                      <CheckCircle />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                    >
                      <Cancel />
                    </IconButton>
                    <IconButton color="primary">
                      <Email />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminDashboard; 