import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FilterList } from '@mui/icons-material';
import ImageDisplay from '../components/ImageDisplay';
import SafariFilter from '../components/SafariFilter';
import api from '../services/api';

const INITIAL_FILTERS = {
  search: '',
  location: '',
  duration: [1, 14],
  priceRange: [0, 5000],
  activities: [],
};

function Safaris() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [safaris, setSafaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Load filters from localStorage or use initial values
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('safariFilters');
    return savedFilters ? JSON.parse(savedFilters) : INITIAL_FILTERS;
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('safariFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const fetchSafaris = async () => {
      try {
        const response = await api.getSafaris();
        setSafaris(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching safaris:', error);
        setLoading(false);
      }
    };
    fetchSafaris();
  }, []);

  const handleSortChange = (sortBy) => {
    const sortedSafaris = [...safaris].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'duration-asc':
          return a.duration - b.duration;
        case 'duration-desc':
          return b.duration - a.duration;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    setSafaris(sortedSafaris);
  };

  const filteredSafaris = safaris.filter((safari) => {
    const matchesSearch = safari.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         safari.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation = !filters.location || safari.destination.location === filters.location;
    const matchesDuration = safari.duration >= filters.duration[0] && 
                           safari.duration <= filters.duration[1];
    const matchesPrice = safari.price >= filters.priceRange[0] && 
                        safari.price <= filters.priceRange[1];
    const matchesActivities = !filters.activities?.length || 
                             filters.activities.every(activity => 
                               safari.included.toLowerCase().includes(activity.toLowerCase()));

    return matchesSearch && matchesLocation && matchesDuration && 
           matchesPrice && matchesActivities;
  });

  const renderFilter = () => (
    <SafariFilter 
      filters={filters} 
      setFilters={setFilters} 
      onSortChange={handleSortChange}
    />
  );

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Available Safaris
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileFilterOpen(true)}>
            <FilterList />
          </IconButton>
        )}
      </Box>
      
      {isMobile ? (
        <Drawer
          anchor="right"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          PaperProps={{
            sx: { width: '100%', maxWidth: 360 }
          }}
        >
          {renderFilter()}
        </Drawer>
      ) : (
        renderFilter()
      )}

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {filteredSafaris.map((safari) => (
          <Grid item xs={12} md={6} key={safari.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
                mb: { xs: 2, md: 0 },
              }}
            >
              <ImageDisplay
                src={safari.image}
                alt={safari.title}
                height={window.innerWidth < 600 ? 140 : 300}
              />
              <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 3 } }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                  {safari.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.97rem', md: '1rem' } }}>
                  {safari.description.substring(0, 200)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                    ${safari.price.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.97rem', md: '1rem' } }}>
                    Duration: {safari.duration} days
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: { xs: 1, md: 2 } }}>
                <Button
                  component={Link}
                  to={`/safaris/${safari.id}`}
                  variant="contained"
                  fullWidth
                  sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, minHeight: 44 }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Safaris; 