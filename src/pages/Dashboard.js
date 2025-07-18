// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Container, List, ListItem, ListItemText, Divider, Card, CardContent, Avatar, Grid, Paper, Button, Stack, Chip, Collapse, Badge } from '@mui/material';
import { Person, Loyalty, History, AddCircle, Edit, Logout, Dashboard as DashboardIcon, Print, ReceiptLong, Download, Hotel, ExpandMore, ExpandLess } from '@mui/icons-material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import TextField from '@mui/material/TextField';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [error, setError] = useState(null);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [accommodationEnquiries, setAccommodationEnquiries] = useState([]);
  const [expandedEnquiry, setExpandedEnquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const navigate = useNavigate();

  const handleBookSafari = () => {
    navigate('/safaris');
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handlePrint = (booking) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .details { margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .ref { font-weight: bold; }
      </style>
      </head><body>
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Thank you for booking with Solvo Tours and Safaris!</p>
        </div>
        <div class="details">
          <h2>Booking Details</h2>
          <p class="ref">Booking Reference: #${booking.booking_details.id}</p>
          <p>Safari: ${booking.booking_details.safari}</p>
          <p>Date: ${booking.booking_details.date}</p>
          <p>Guests: ${booking.booking_details.guests}</p>
          <p>Total Price: $${booking.booking_details.total_price}</p>
          <p>Status: ${booking.booking_details.status}</p>
        </div>
        <div class="details">
          <h2>Payment Information</h2>
          <p>Status: ${booking.booking_details.payment_status}</p>
          <p>History: ${JSON.stringify(booking.booking_details.payment_history)}</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>We look forward to hosting you on your safari adventure!</p>
        </div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Booking Confirmation', 14, 20);
    doc.setFontSize(12);
    doc.text(`Booking Reference: #${booking.booking_details.id}`, 14, 35);
    doc.text(`Safari: ${booking.booking_details.safari}`, 14, 45);
    doc.text(`Date: ${booking.booking_details.date}`, 14, 55);
    doc.text(`Guests: ${booking.booking_details.guests}`, 14, 65);
    doc.text(`Total Price: $${booking.booking_details.total_price}`, 14, 75);
    doc.text(`Status: ${booking.booking_details.status}`, 14, 85);
    doc.text(`Payment Status: ${booking.booking_details.payment_status}`, 14, 95);
    doc.text(`Payment History: ${JSON.stringify(booking.booking_details.payment_history)}`, 14, 105);
    doc.save(`Booking_#${booking.booking_details.id}.pdf`);
  };

  const handleViewReceipt = (booking) => {
    setSelectedBooking(booking);
    setOpenReceipt(true);
  };
  const handleCloseReceipt = () => {
    setOpenReceipt(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setProfile(response.data);
        setError(null);
        console.log('Profile response:', response.data);
      } catch (error) {
        let errorMsg = 'Failed to load profile. Please try logging in again.';
        if (error.response && error.response.data) {
          errorMsg = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
        }
        setError(errorMsg);
        setProfile(null);
        console.error('Error fetching profile:', error);
      }
    };
    const fetchBookings = async () => {
      try {
        const response = await api.getBookingHistory();
        setBookingHistory(response.data);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };
    const fetchAccommodationEnquiries = async () => {
      try {
        const response = await api.getAccommodationEnquiries();
        setAccommodationEnquiries(response.data);
      } catch (error) {
        console.error('Error fetching accommodation enquiries:', error);
      }
    };
    fetchProfile();
    fetchBookings();
    fetchAccommodationEnquiries();
  }, []);

  useEffect(() => {
    // Auto-reload the dashboard page once after redirect
    if (!sessionStorage.getItem('dashboardReloaded')) {
      sessionStorage.setItem('dashboardReloaded', 'true');
      window.location.reload();
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Welcome Banner */}
        {profile && !error && (
          <Paper elevation={3} sx={{ width: '100%', mb: 5, p: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 4, textAlign: 'center', boxShadow: 6 }}>
            <DashboardIcon sx={{ fontSize: 44, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 1, mb: 1 }}>
              Welcome back, {profile.username ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1) : 'User'}!
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Solvo Tours and Safaris has got you covered.
            </Typography>
          </Paper>
        )}
        {error && (
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        {!error && !profile && (
          <Typography variant="h6">Loading...</Typography>
        )}
        {profile && !error && (
          <>
            {/* Top Row: Profile, Summary, Booking History */}
            <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3, borderRadius: 4, bgcolor: 'white', height: '100%' }}>
                  <Avatar sx={{ width: 90, height: 90, mb: 2, bgcolor: 'primary.main', fontSize: 48, boxShadow: 2 }}>
                    <Person fontSize="inherit" />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: 0.5 }}>
                    {profile.username ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1) : 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {profile.email}
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <Loyalty sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body1">Loyalty Points: {profile.loyalty_points ?? 0}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Preferences</Typography>
                    <Paper variant="outlined" sx={{ p: 1, mt: 1, minHeight: 40, bgcolor: '#f9f9f9' }}>
                      {profile.preferences && Object.keys(profile.preferences).length > 0
                        ? Object.entries(profile.preferences).map(([key, value]) => (
                            <Typography key={key} variant="body2">{key}: {String(value)}</Typography>
                          ))
                        : <Typography variant="body2" color="text.secondary">No preferences set.</Typography>}
                    </Paper>
                  </Box>
                  {/* Quick Actions */}
                  <Stack direction="row" spacing={2} sx={{ mt: 3, width: '100%' }} justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<AddCircle />}
                      color="success"
                      onClick={handleBookSafari}
                      sx={{ flex: 1, minWidth: 100, fontWeight: 600 }}
                    >
                      Book Safari
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      color="warning"
                      onClick={handleEditProfile}
                      sx={{ flex: 1, minWidth: 100, fontWeight: 600 }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Logout />}
                      color="error"
                      onClick={handleLogout}
                      sx={{ flex: 1, minWidth: 100, fontWeight: 600 }}
                    >
                      Logout
                    </Button>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, boxShadow: 3, borderRadius: 4, bgcolor: '#f4f8fd', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', letterSpacing: 0.5 }}>
                    Dashboard Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    <Typography variant="body1"><b>Upcoming Safaris:</b> {bookingHistory.filter(b => b.booking_details && b.booking_details.status === 'confirmed').length}</Typography>
                    <Typography variant="body1"><b>Total Bookings:</b> {bookingHistory.length}</Typography>
                    <Typography variant="body1"><b>Pending Bookings:</b> {bookingHistory.filter(b => b.booking_details && b.booking_details.status === 'pending').length}</Typography>
                    <Typography variant="body1"><b>Cancelled Bookings:</b> {bookingHistory.filter(b => b.booking_details && b.booking_details.status === 'cancelled').length}</Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, boxShadow: 3, borderRadius: 4, bgcolor: 'white', height: '100%' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <History sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                      Your Booking History
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {bookingHistory.length === 0 && <ListItem><ListItemText primary="No bookings found." /></ListItem>}
                    {bookingHistory.map((item) => (
                      <ListItem key={item.id} divider sx={{ borderRadius: 2, mb: 1, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Safari: {item.booking_details && item.booking_details.safari ? item.booking_details.safari : 'N/A'}
                              <span style={{ marginLeft: 8, fontWeight: 400, fontSize: 14, color: '#888' }}>Ref: #{item.booking_details && item.booking_details.id}</span>
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">Date: {item.booking_details && item.booking_details.date ? item.booking_details.date : 'N/A'}</Typography>
                              <Typography variant="body2">Status: <span style={{ color: item.booking_details.status === 'confirmed' ? 'green' : item.booking_details.status === 'pending' ? 'orange' : 'red', fontWeight: 600 }}>{item.booking_details && item.booking_details.status ? item.booking_details.status : 'N/A'}</span></Typography>
                              <Typography variant="body2">Guests: {item.booking_details && item.booking_details.guests ? item.booking_details.guests : 'N/A'}</Typography>
                              <Typography variant="body2">Total: ${item.booking_details && item.booking_details.total_price ? item.booking_details.total_price : 'N/A'}</Typography>
                            </>
                          }
                        />
                        <Tooltip title="Print Confirmation"><IconButton onClick={() => handlePrint(item)}><Print /></IconButton></Tooltip>
                        <Tooltip title="Download PDF"><IconButton onClick={() => handleDownloadPDF(item)}><Download /></IconButton></Tooltip>
                        <Tooltip title="View Receipt"><IconButton onClick={() => handleViewReceipt(item)}><ReceiptLong /></IconButton></Tooltip>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
            {/* Bottom Row: Accommodation Enquiries */}
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              <Grid item xs={12} sx={{ mt: { xs: 4, md: 8 } }}>
                <Card sx={{ p: 4, boxShadow: 3, borderRadius: 4, bgcolor: 'white', width: '100%' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Hotel sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                      Your Accommodation Enquiries
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {accommodationEnquiries.length === 0 && <ListItem><ListItemText primary="No accommodation enquiries found." /></ListItem>}
                    {accommodationEnquiries.map((enquiry) => {
                      const statusColor =
                        enquiry.status === 'completed' ? 'success' :
                        enquiry.status === 'in_progress' ? 'warning' :
                        enquiry.status === 'cancelled' ? 'error' : 'default';
                      const unreadAdminMessages = enquiry.messages?.filter(m => m.sender === 'admin' && !m.is_read).length || 0;

                      // Parse message for check-in, check-out, guests, special requests, how did you hear
                      let checkin = '', checkout = '', guests = '', special = '', heard = '';
                      if (enquiry.message) {
                        const lines = enquiry.message.split('\n');
                        lines.forEach(line => {
                          if (line.toLowerCase().includes('check-in')) checkin = line.replace('Check-in:', '').trim();
                          if (line.toLowerCase().includes('check-out')) checkout = line.replace('Check-out:', '').trim();
                          if (line.toLowerCase().includes('guests')) guests = line.replace('Guests:', '').trim();
                          if (line.toLowerCase().includes('special requests')) special = line.replace('Special Requests:', '').trim();
                          if (line.toLowerCase().includes('how did you hear')) heard = line.replace('How did you hear about us:', '').trim();
                        });
                      }
                      return (
                        <React.Fragment key={enquiry.id}>
                          <ListItem divider sx={{ borderRadius: 2, mb: 1, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
                            <ListItemText
                              primary={
                                <Box>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {enquiry.accommodation} <span style={{ marginLeft: 8, fontWeight: 400, fontSize: 14, color: '#888' }}>Sent: {new Date(enquiry.created_at).toLocaleDateString()}</span>
                                    </Typography>
                                    <Chip label={enquiry.status?.replace('_', ' ').toUpperCase()} color={statusColor} size="small" />
                                    {unreadAdminMessages > 0 && (
                                      <Badge color="error" badgeContent={unreadAdminMessages} sx={{ ml: 1 }}>
                                        <Typography variant="caption" color="error">New Response</Typography>
                                      </Badge>
                                    )}
                                    {enquiry.messages && enquiry.messages.length > 0 && (
                                      <IconButton size="small" onClick={async () => {
                                        setExpandedEnquiry(expandedEnquiry === enquiry.id ? null : enquiry.id);
                                        if (expandedEnquiry !== enquiry.id && unreadAdminMessages > 0) {
                                          // Mark admin messages as read
                                          const token = localStorage.getItem('access_token');
                                          await api.post(`/api/accommodation-enquiries/${enquiry.id}/mark-read/`, {}, {
                                            headers: { Authorization: `Bearer ${token}` }
                                          });
                                        }
                                      }}>
                                        {expandedEnquiry === enquiry.id ? <ExpandLess /> : <ExpandMore />}
                                      </IconButton>
                                    )}
                                  </Box>
                                  {/* Each field on its own line */}
                                  <Typography variant="body2"><b>Name:</b> {enquiry.name}</Typography>
                                  <Typography variant="body2"><b>Email:</b> {enquiry.email}</Typography>
                                  <Typography variant="body2"><b>Phone:</b> {enquiry.phone || 'N/A'}</Typography>
                                  {checkin && <Typography variant="body2"><b>Check-in:</b> {checkin}</Typography>}
                                  {checkout && <Typography variant="body2"><b>Check-out:</b> {checkout}</Typography>}
                                  {guests && <Typography variant="body2"><b>Guests:</b> {guests}</Typography>}
                                  {special && <Typography variant="body2"><b>Special Requests:</b> {special}</Typography>}
                                  {heard && <Typography variant="body2"><b>How did you hear about us:</b> {heard}</Typography>}
                                </Box>
                              }
                            />
                          </ListItem>
                          {enquiry.messages && (
                            <Collapse in={expandedEnquiry === enquiry.id} timeout="auto" unmountOnExit>
                              <Box sx={{ bgcolor: '#f4f8fd', p: 3, borderRadius: 3, mb: 2, ml: 2, boxShadow: 1 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 700 }}>Conversation</Typography>
                                <List sx={{ maxHeight: 220, overflowY: 'auto', mb: 2 }}>
                                  {enquiry.messages.map(msg => (
                                    <ListItem key={msg.id} alignItems="flex-start" sx={{ pl: 0, mb: 1, bgcolor: msg.sender === 'admin' ? '#e3f2fd' : 'white', borderRadius: 2, boxShadow: msg.sender === 'admin' ? 1 : 0 }}>
                                      <ListItemText
                                        primary={<Typography sx={{ fontWeight: msg.sender === 'admin' ? 700 : 400, color: msg.sender === 'admin' ? 'primary.main' : 'text.primary' }}>{msg.sender === 'admin' ? 'Admin' : 'You'}</Typography>}
                                        secondary={<>
                                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.message}</Typography>
                                          <Typography variant="caption" color="text.secondary">{new Date(msg.created_at).toLocaleString()}</Typography>
                                        </>}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                {enquiry.status !== 'cancelled' && (
                                  <Box component="form" onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!replyMessage.trim()) return;
                                    setSendingReply(true);
                                    const token = localStorage.getItem('access_token');
                                    await api.post(`/api/accommodation-enquiries/${enquiry.id}/messages/`, { message: replyMessage }, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    setReplyMessage('');
                                    setSendingReply(false);
                                    // Refresh the enquiries list
                                    const response = await api.getAccommodationEnquiries();
                                    setAccommodationEnquiries(response.data);
                                  }} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <TextField
                                      value={replyMessage}
                                      onChange={e => setReplyMessage(e.target.value)}
                                      size="small"
                                      placeholder="Type your reply..."
                                      fullWidth
                                      disabled={sendingReply}
                                      sx={{ bgcolor: 'white', borderRadius: 2 }}
                                    />
                                    <Button type="submit" variant="contained" color="primary" disabled={sendingReply || !replyMessage.trim()} sx={{ fontWeight: 600, borderRadius: 2 }}>Send</Button>
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      <Dialog open={openReceipt} onClose={handleCloseReceipt} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Receipt</DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Booking Reference: #{selectedBooking.booking_details.id}</Typography>
              <Typography variant="body2">Safari: {selectedBooking.booking_details.safari}</Typography>
              <Typography variant="body2">Date: {selectedBooking.booking_details.date}</Typography>
              <Typography variant="body2">Guests: {selectedBooking.booking_details.guests}</Typography>
              <Typography variant="body2">Total Price: ${selectedBooking.booking_details.total_price}</Typography>
              <Typography variant="body2">Status: <span style={{ color: selectedBooking.booking_details.status === 'confirmed' ? 'green' : selectedBooking.booking_details.status === 'pending' ? 'orange' : 'red', fontWeight: 600 }}>{selectedBooking.booking_details.status}</span></Typography>
              <Typography variant="body2">Payment Status: {selectedBooking.booking_details.payment_status}</Typography>
              <Typography variant="body2">Payment History: {JSON.stringify(selectedBooking.booking_details.payment_history)}</Typography>
              <Typography variant="body2">Created At: {selectedBooking.booking_details.created_at}</Typography>
              <Typography variant="body2">Updated At: {selectedBooking.booking_details.updated_at}</Typography>
              <Typography variant="body2">Cancellation Policy: {selectedBooking.booking_details.cancellation_policy || 'N/A'}</Typography>
              <Typography variant="body2">Refund Terms: {selectedBooking.booking_details.refund_terms || 'N/A'}</Typography>
              <Typography variant="body2">Emergency Contact: {selectedBooking.booking_details.emergency_contact_name || 'N/A'} ({selectedBooking.booking_details.emergency_contact_phone || 'N/A'})</Typography>
              <Typography variant="body2">Special Dietary Requirements: {selectedBooking.booking_details.special_dietary_requirements || 'N/A'}</Typography>
              <Typography variant="body2">Insurance Options: {JSON.stringify(selectedBooking.booking_details.insurance_options)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceipt}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;