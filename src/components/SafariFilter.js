import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Button,
} from '@mui/material';
import {
  FilterList,
  Sort,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

function SafariFilter({ filters, setFilters, onSortChange }) {
  const [expanded, setExpanded] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('price-asc');

  const activities = [
    'Game Drives',
    'Bird Watching',
    'Cultural Visits',
    'Photography',
    'Hiking',
    'Night Safari',
    'Balloon Safari',
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleActivityToggle = (activity) => {
    const currentActivities = filters.activities || [];
    const newActivities = currentActivities.includes(activity)
      ? currentActivities.filter(a => a !== activity)
      : [...currentActivities, activity];
    
    setFilters({ ...filters, activities: newActivities });
  };

  return (
    <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6">Filter & Sort</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => handleSortChange(e.target.value)}
              startAdornment={<Sort sx={{ mr: 1, ml: -0.5 }} />}
            >
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="duration-asc">Duration: Shortest First</MenuItem>
              <MenuItem value="duration-desc">Duration: Longest First</MenuItem>
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
              <MenuItem value="name-desc">Name: Z to A</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={filters.location}
                  label="Location"
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="Kenya">Kenya</MenuItem>
                  <MenuItem value="Tanzania">Tanzania</MenuItem>
                  <MenuItem value="Uganda">Uganda</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>Duration (days)</Typography>
              <Slider
                value={filters.duration}
                onChange={(_, newValue) => setFilters({ ...filters, duration: newValue })}
                valueLabelDisplay="auto"
                min={1}
                max={14}
                marks={[
                  { value: 1, label: '1d' },
                  { value: 7, label: '7d' },
                  { value: 14, label: '14d' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>Price Range ($)</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(_, newValue) => setFilters({ ...filters, priceRange: newValue })}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={100}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 2500, label: '$2.5k' },
                  { value: 5000, label: '$5k' },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Activities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activities.map((activity) => (
                  <Chip
                    key={activity}
                    label={activity}
                    onClick={() => handleActivityToggle(activity)}
                    color={filters.activities?.includes(activity) ? 'primary' : 'default'}
                    variant={filters.activities?.includes(activity) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setFilters({
                search: '',
                location: '',
                duration: [1, 14],
                priceRange: [0, 5000],
                activities: [],
              })}
            >
              Reset Filters
            </Button>
            <Button 
              variant="contained"
              onClick={() => setExpanded(false)}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default SafariFilter; 