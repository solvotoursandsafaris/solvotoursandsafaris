import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import KingBedIcon from '@mui/icons-material/KingBed';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import OptimizedImage from '../components/OptimizedImage';
import ImageGallery from '../components/ImageGallery';
import api from '../services/api';
import BookingForm from '../components/BookingForm';
import axios from 'axios';
import { useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-image-gallery/styles/css/image-gallery.css';

function SafariImageGallery({ images }) {
  // Ensure images is always an array of objects with 'original' and 'thumbnail' keys
  const safeImages = Array.isArray(images)
    ? images.filter(img => img && typeof img.original === 'string' && typeof img.thumbnail === 'string')
    : [];
  if (safeImages.length === 0) return null;
  try {
    return (
      <Box sx={{ mb: 4 }}>
        <ImageGallery items={safeImages} showPlayButton={false} showFullscreenButton={true} />
      </Box>
    );
  } catch (e) {
    console.error('ImageGallery error:', e, safeImages);
    return null;
  }
}

function TabPanel({ children, value, index, ...props }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`safari-tabpanel-${index}`}
      {...props}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </Box>
  );
}

function SafariDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [safari, setSafari] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const isDesktop = useMediaQuery('(min-width:900px)');

  useEffect(() => {
    const fetchSafariDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/safaris/${id}/`);
        setSafari(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching safari details:', error);
        setLoading(false);
      }
    };
    fetchSafariDetails();
  }, [id]);

  if (loading || !safari) {
    return <div>Loading...</div>;
  }

  // Remove SafariImageGallery and all gallery logic
  // Only render SafariImageGallery if galleryImages is a valid non-empty array
  const showGallery = Array.isArray(safari?.images) && safari.images.length > 0 && safari.images.every(img => typeof img === 'string');
  // Debug log
  console.log('galleryImages for SafariImageGallery:', safari.images);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Image Gallery removed due to runtime errors */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <OptimizedImage
            src={safari.image}
            alt={safari.title}
            sx={{
              width: '100%',
              height: 400,
              borderRadius: 2,
              mb: 3,
            }}
          />

          <Typography variant="h3" component="h1" gutterBottom>
            {safari.title}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Overview" />
              <Tab label="Itinerary" />
              <Tab label="Gallery" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" paragraph>
              {safari.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" gutterBottom>
                        <ExploreIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Difficulty Level
                    </Typography>
                    <Typography variant="body1">
                        {safari.difficulty_level.charAt(0).toUpperCase() + safari.difficulty_level.slice(1)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" gutterBottom>
                        <PeopleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Max Group Size
                    </Typography>
                    <Typography variant="body1">
                        {safari.max_group_size} people
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" gutterBottom>
                        <ChildFriendlyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Min Age Requirement
                    </Typography>
                    <Typography variant="body1">
                        {safari.min_age_requirement} years old
                    </Typography>
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              <EventAvailableIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Seasonal Availability
            </Typography>
            <List>
                {Object.entries(safari.seasonal_availability).map(([month, available]) => (
                    available && (
                        <ListItem key={month}>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary={month.charAt(0).toUpperCase() + month.slice(1)} />
                        </ListItem>
                    )
                ))}
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              <ExploreIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Departure Points
            </Typography>
            <List>
                {safari.departure_points.map((point, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary={point} />
                    </ListItem>
                ))}
            </List>
            
            {/* Expandable What's Included/Excluded */}
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">What's Included</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{safari?.included || 'No details provided.'}</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">What's Not Included</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{safari?.excluded || 'No details provided.'}</Typography>
              </AccordionDetails>
            </Accordion>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {safari.itineraries && safari.itineraries.length > 0 ? (
                <List>
                    {safari.itineraries.map((day, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemText 
                                    primary={
                                        <Typography variant="h6">
                                            Day {day.day_number}: {day.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {day.description}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                {day.activities && day.activities.length > 0 && (
                                    <ListItem>
                                        <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                                        <ListItemText primary="Activities:" />
                                    </ListItem>
                                )}
                                {day.activities && day.activities.map((activity, idx) => (
                                    <ListItem key={idx} sx={{ pl: 6 }}>
                                        <ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary={activity} />
                                    </ListItem>
                                ))}

                                {day.meals_included && day.meals_included.length > 0 && (
                                    <ListItem>
                                        <ListItemIcon><RestaurantIcon /></ListItemIcon>
                                        <ListItemText primary="Meals Included:" />
                                    </ListItem>
                                )}
                                {day.meals_included && day.meals_included.map((meal, idx) => (
                                    <ListItem key={idx} sx={{ pl: 6 }}>
                                        <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                        <ListItemText primary={meal.charAt(0).toUpperCase() + meal.slice(1)} />
                                    </ListItem>
                                ))}

                                {day.accommodation && (
                                    <ListItem>
                                        <ListItemIcon><KingBedIcon /></ListItemIcon>
                                        <ListItemText primary={`Accommodation: ${day.accommodation}`} />
                                    </ListItem>
                                )}

                                {(day.start_time || day.end_time) && (
                                    <ListItem>
                                        <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                                        <ListItemText primary={`Time: ${day.start_time || ''} - ${day.end_time || ''}`} />
                                    </ListItem>
                                )}
                            </List>
                            <Divider component="li" sx={{ my: 2 }} />
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">No itinerary available for this safari.</Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* ImageGallery images={galleryImages} removed */}
          </TabPanel>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Sticky Booking Card */}
          <Box sx={{ position: isDesktop ? 'sticky' : 'static', top: isDesktop ? 100 : 'auto', zIndex: 2 }}>
            <BookingForm 
              safari={safari} 
              onSuccess={(booking) => {
                navigate(`/booking/${booking.id}`);
              }} 
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SafariDetail; 