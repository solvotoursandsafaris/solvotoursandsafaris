import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Rename component
const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const response = await fetch('/api/accommodations/');
      const data = await response.json();
      setAccommodations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setLoading(false);
    }
  };

  // Extract unique countries for filter dropdown
  const countries = Array.from(new Set(accommodations.map(acc => (acc.country || (acc.location && acc.location.split(',').pop().trim()))))).filter(Boolean);

  // Find min/max price for slider
  const minPrice = Math.min(...accommodations.map(acc => acc.price_per_night || 0), 0);
  const maxPrice = Math.max(...accommodations.map(acc => acc.price_per_night || 0), 2000);

  // Find min/max rating for dropdown
  const ratings = Array.from(new Set(accommodations.map(acc => Math.floor(acc.rating)))).sort((a, b) => b - a);

  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || acc.type === typeFilter;
    const matchesCountry = countryFilter === 'all' || (acc.country ? acc.country === countryFilter : (acc.location && acc.location.includes(countryFilter)));
    const matchesPrice = (acc.price_per_night || 0) >= priceRange[0] && (acc.price_per_night || 0) <= priceRange[1];
    const matchesRating = ratingFilter === 'all' || Math.floor(acc.rating) >= parseInt(ratingFilter);
    return matchesSearch && matchesType && matchesCountry && matchesPrice && matchesRating;
  });

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Our Accommodations
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="lodge">Lodges</MenuItem>
              <MenuItem value="camp">Camps</MenuItem>
              <MenuItem value="hotel">Hotels</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={countryFilter}
              label="Country"
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <MenuItem value="all">All Countries</MenuItem>
              {countries.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ minWidth: 220, px: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 1 }}>Price</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={minPrice}
              max={maxPrice}
              step={10}
              sx={{ width: 120 }}
            />
          </Box>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={ratingFilter}
              label="Rating"
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <MenuItem value="all">All Ratings</MenuItem>
              {ratings.map((r) => (
                <MenuItem key={r} value={r}>{r}+</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={4}>
          {filteredAccommodations.map((accommodation) => (
            <Grid item key={accommodation.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={accommodation.image}
                  alt={accommodation.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" component="h2">
                      {accommodation.name}
                    </Typography>
                    <Chip
                      label={accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {accommodation.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {accommodation.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      ${accommodation.price_per_night}/night
                    </Typography>
                    <Chip
                      label={`${accommodation.rating} ★`}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      component={Link}
                      to={`/accommodations/${accommodation.id}`}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Accommodations; 