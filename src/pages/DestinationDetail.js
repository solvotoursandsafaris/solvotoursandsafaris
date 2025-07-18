import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Chip, Button, CircularProgress, Paper } from '@mui/material';
import { LocationOn, ArrowBack } from '@mui/icons-material';
import ImageDisplay from '../components/ImageDisplay';
import api from '../services/api';

function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await api.getSafariById(id); // Try safaris endpoint first
        setDestination(response.data);
        setLoading(false);
      } catch (error) {
        try {
          const response = await api.getDestinations();
          const found = response.data.find(d => String(d.id) === String(id));
          if (found) {
            setDestination(found);
          } else {
            // Fallback for Diani Beach (1006) and Watamu Marine National Park (1007)
            if (String(id) === '1006') {
              setDestination({
                id: 1006,
                name: 'Diani Beach',
                location: 'Kenya',
                description: 'A pristine white-sand beach stretching 17km along the Indian Ocean. Perfect for combining beach relaxation with water sports and marine life experiences.',
                best_time: 'December to March, July to October',
                highlights: 'White Sand Beaches, Water Sports, Coral Reefs, Colobus Monkeys',
                image: '/images/diani_beach.jpg',
              });
            } else if (String(id) === '1007') {
              setDestination({
                id: 1007,
                name: 'Watamu Marine National Park',
                location: 'Kenya',
                description: 'A protected marine park known for its coral gardens, sea turtles, and diverse marine life. Offers excellent snorkeling, diving, and dhow sailing experiences.',
                best_time: 'October to April',
                highlights: 'Coral Gardens, Sea Turtles, Whale Watching, Ancient Ruins',
                image: '/images/watamu_marine.jpg',
              });
            } else {
              setNotFound(true);
            }
          }
        } catch {
          setNotFound(true);
        }
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 8, minHeight: '60vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (notFound || !destination) {
    return (
      <Container sx={{ py: 8, minHeight: '60vh' }}>
        <Typography variant="h4" color="error" align="center" gutterBottom>
          Destination Not Found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" component={Link} to="/destinations" startIcon={<ArrowBack />}>
            Back to Destinations
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6, minHeight: '60vh' }}>
      <Button variant="outlined" component={Link} to="/destinations" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Destinations
      </Button>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <ImageDisplay
              src={destination.image}
              alt={destination.name}
              height={340}
              style={{ borderRadius: 8, width: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <Typography variant="h3" gutterBottom>
              {destination.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" color="text.secondary">
                {destination.location}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {destination.description}
            </Typography>
            {destination.best_time && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Best Time to Visit:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {destination.best_time}
                </Typography>
              </Box>
            )}
            {destination.highlights && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {destination.highlights.split(',').map((highlight, index) => (
                  <Chip
                    key={index}
                    label={highlight.trim()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default DestinationDetail; 