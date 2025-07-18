import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  WhatsApp,
} from '@mui/icons-material';
import api from '../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.sendContactMessage(formData);
      setSnackbar({
        open: true,
        message: 'Message sent successfully! We will get back to you soon.',
        severity: 'success',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // WhatsApp floating button
  const whatsappNumber = '+254741106404';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  return (
    <>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h5">
            Get in Touch for Your Next Adventure
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mb: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              Get In Touch
            </Typography>
            <Typography paragraph color="text.secondary">
              Have questions about our safaris? Want to customize your trip?
              We're here to help make your African adventure unforgettable.
            </Typography>

            <Box sx={{ mt: 4 }}>
              {[
                {
                  icon: <Phone />,
                  title: "Phone",
                  content: ["+254 741 106 404", "+254 790 153 077"]
                },
                {
                  icon: <Email />,
                  title: "Email",
                  content: ["solvotoursandsafaris@gmail.com", "omaikomark1@gmail.com"]
                },
                {
                  icon: <LocationOn />,
                  title: "Office",
                  content: "Viewpark Towers 1st Floor Suite 8, Nairobi, Kenya" // Add your office address here

                }
              ].map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Array.isArray(item.content)
                        ? item.title === 'Phone'
                          ? item.content.map((num, idx) => (
                              <span key={idx}>
                                <a href={`tel:${num.replace(/\s+/g, '')}`} style={{color: 'inherit', textDecoration: 'none'}} aria-label={`Call ${num}`}>{num}</a><br/>
                              </span>
                            ))
                          : item.title === 'Email'
                            ? item.content.map((email, idx) => (
                                <span key={idx}>
                                  <a href={`mailto:${email}`} style={{color: 'inherit', textDecoration: 'none'}} aria-label={`Email ${email}`}>{email}</a><br/>
                                </span>
                              ))
                            : item.content
                        : item.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

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

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          zIndex: 1300,
          background: '#25D366',
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          color: 'white',
          textDecoration: 'none',
        }}
        aria-label="Chat on WhatsApp"
      >
        <WhatsApp fontSize="large" />
      </a>
    </>
  );
}

export default Contact; 