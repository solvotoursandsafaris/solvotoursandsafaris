import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  Skeleton,
  useTheme,
  TextField,
  InputAdornment,
  MenuItem,
  Button
} from '@mui/material';
import { LocationOn, AccessTime, Search } from '@mui/icons-material';
import ImageDisplay from '../components/ImageDisplay';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.getDestinations();
        setDestinations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Extract unique countries for filter dropdown
  const countries = Array.from(new Set(destinations.map(d => d.location)));

  // Filter destinations by search and country
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch =
      destination.name.toLowerCase().includes(search.toLowerCase()) ||
      destination.location.toLowerCase().includes(search.toLowerCase()) ||
      destination.highlights.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = country ? destination.location === country : true;
    return matchesSearch && matchesCountry;
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Popular Destinations
      </Typography>
      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search destinations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220 }}
        />
        <TextField
          select
          label="Filter by Country"
          value={country}
          onChange={e => setCountry(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All Countries</MenuItem>
          {countries.map(c => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Grid container spacing={4}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton height={32} />
                    <Skeleton height={60} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : filteredDestinations.map((destination) => {
              let correctId = destination.id;
              if (destination.name === "Diani Beach") correctId = 1006;
              if (destination.name === "Watamu Marine National Park") correctId = 1007;
              return (
                <Grid item xs={12} sm={6} md={4} key={destination.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <ImageDisplay
                      src={destination.image}
                      alt={destination.name}
                      height={240}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {destination.name}
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {destination.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {destination.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Best Time to Visit:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {destination.best_time}
                        </Typography>
                      </Box>
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
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to={`/destinations/${correctId}`}
                        size="small"
                      >
                        View More
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
    </Container>
  );
}

export default Destinations; 