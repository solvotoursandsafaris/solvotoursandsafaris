import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';

const AccommodationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherAccommodations, setOtherAccommodations] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/accommodations/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setAccommodation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch('/api/accommodations/')
      .then((res) => res.json())
      .then((data) => {
        setOtherAccommodations(data.filter((a) => String(a.id) !== String(id)));
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!accommodation) {
    return <Typography align="center">Accommodation not found.</Typography>;
  }

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Button component={Link} to="/accommodations" variant="outlined" sx={{ mb: 3 }}>
              &larr; Back to All Accommodations
            </Button>
            <Card sx={{ mb: 4 }}>
              <CardMedia
                component="img"
                height="400"
                image={accommodation.image}
                alt={accommodation.name}
              />
            </Card>
            {/* Gallery Section */}
            {accommodation.gallery_images && accommodation.gallery_images.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Gallery</Typography>
                <ImageList cols={3} gap={12} sx={{ width: '100%', maxHeight: 340 }}>
                  {accommodation.gallery_images.map((img, idx) => (
                    <ImageListItem key={img.id} style={{ cursor: 'pointer' }} onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}>
                      <img
                        src={img.image}
                        alt={img.caption || accommodation.name}
                        loading="lazy"
                        style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: 120 }}
                      />
                      {img.caption && (
                        <ImageListItemBar title={img.caption} position="below" />
                      )}
                    </ImageListItem>
                  ))}
                </ImageList>
                {lightboxOpen && (
                  <Lightbox
                    mainSrc={accommodation.gallery_images[lightboxIndex].image}
                    nextSrc={accommodation.gallery_images[(lightboxIndex + 1) % accommodation.gallery_images.length].image}
                    prevSrc={accommodation.gallery_images[(lightboxIndex + accommodation.gallery_images.length - 1) % accommodation.gallery_images.length].image}
                    onCloseRequest={() => setLightboxOpen(false)}
                    onMovePrevRequest={() => setLightboxIndex((lightboxIndex + accommodation.gallery_images.length - 1) % accommodation.gallery_images.length)}
                    onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % accommodation.gallery_images.length)}
                    imageCaption={accommodation.gallery_images[lightboxIndex].caption}
                    animationDuration={350}
                    enableZoom={false}
                  />
                )}
              </Box>
            )}
            <Typography variant="h3" gutterBottom>{accommodation.name}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip label={accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)} color="primary" />
              <Chip label={`${accommodation.rating} ★`} color="secondary" />
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>{accommodation.location}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{accommodation.description}</Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              ${accommodation.price_per_night} / night
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              <strong>Amenities:</strong> {accommodation.amenities}
            </Typography>
            {accommodation.is_featured && (
              <Chip label="Featured" color="success" sx={{ mt: 2 }} />
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Enquire Now Card */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Enquire Now</Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
                <MonetizationOnIcon sx={{ mr: 1 }} />
                ${accommodation.price_per_night}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>/night</Typography>
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={() => navigate(`/accommodations/${id}/enquire`)}>
                Enquire Now
              </Button>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <span role="img" aria-label="check">✔️</span> Free date change<br />
                <span role="img" aria-label="check">✔️</span> No Booking Fees<br />
                <span role="img" aria-label="check">✔️</span> Instant Confirmation
              </Typography>
            </Paper>

            {/* Other Accommodations */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Other Accommodations</Typography>
              <List>
                {otherAccommodations.slice(0, 4).map((other) => (
                  <ListItem button key={other.id} alignItems="flex-start" onClick={() => navigate(`/accommodations/${other.id}`)}>
                    <ListItemAvatar>
                      <Avatar variant="rounded" src={other.image} alt={other.name} sx={{ width: 56, height: 56, mr: 2 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={other.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            ${other.price_per_night}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccommodationDetail; 