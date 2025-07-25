import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  useTheme,
  Chip,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import { 
  LocationOn, 
  AccessTime, 
  Star, 
  Adjust as AdjustIcon, 
  Security as SecurityIcon, 
  Diamond as DiamondIcon,
  WhatsApp as WhatsAppIcon,
  ArrowDownward as ArrowDownwardIcon,
  Group as GroupIcon,
  TravelExplore as SafariIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIconMUI,
  SupportAgent as SupportAgentIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalDining as LocalDiningIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRef } from 'react';
import Wave from 'react-wavify';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SafariMap from '../components/SafariMap';

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

const testimonials = [
  {
    name: 'Jane Mwangi',
    photo: '/images/testimonials/jane.jpg',
    rating: 5,
    quote: 'The safari was a dream come true! The guides were amazing and every detail was perfect. Highly recommend Solvo!'
  },
  {
    name: 'David Kimani',
    photo: '/images/testimonials/david.jpg',
    rating: 5,
    quote: 'We saw the Big Five and had the best family holiday ever. The team was so helpful and friendly.'
  },
  {
    name: 'Sarah Otieno',
    photo: '/images/testimonials/sarah.jpg',
    rating: 4.5,
    quote: 'Beautiful lodges, great food, and unforgettable wildlife. I will book again!'
  },
  {
    name: 'John Smith',
    photo: '/images/testimonials/john.jpg',
    rating: 5,
    quote: 'Professional, safe, and fun. The best way to experience Africa!'
  }
];

function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const handlePrev = () => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const handleNext = () => setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const t = testimonials[index];
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', my: 6, position: 'relative', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        What Our Travelers Say
      </Typography>
      <Card elevation={4} sx={{ p: 3, borderRadius: 3, minHeight: 260, transition: 'box-shadow 0.3s', boxShadow: 6 }}>
        <CardContent>
          <Avatar src={t.photo} alt={t.name} sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} />
          <Rating value={t.rating} precision={0.5} readOnly sx={{ mb: 1 }} />
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
            “{t.quote}”
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t.name}
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <IconButton onClick={handlePrev}><ArrowBackIosNewIcon /></IconButton>
        <IconButton onClick={handleNext}><ArrowForwardIosIcon /></IconButton>
      </Box>
    </Box>
  );
}

function AnimatedCounter({ end, label }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = Math.ceil(end / (duration / 20));
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [end]);
  return (
    <Box sx={{ textAlign: 'center', mx: 2 }}>
      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>{count.toLocaleString()}</Typography>
      <Typography variant="subtitle1" color="text.secondary">{label}</Typography>
    </Box>
  );
}

function Home() {
  const featuredSafarisRef = useRef(null);
  const handleScrollToFeatured = () => {
    if (featuredSafarisRef.current) {
      featuredSafarisRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const isMobile = useMediaQuery('(max-width:600px)');

  const theme = useTheme();
  const [homeData, setHomeData] = useState(null);
  const [featuredSafaris, setFeaturedSafaris] = useState([
    {
      id: 7, // Great Migration Safari
      title: 'Masai Mara',
      image: '/images/masai_mara.jpg', // Replace with actual image path
      location: 'Masai Mara National Reserve',
      duration: '3 Days',
      rating: 5,
      price: 1200,
      details: 'Great Migration Safari',
    },
    {
      id: 10, // Amboseli Elephants and Mountain
      title: 'Amboseli',
      image: '/images/amboseli.jpg', // Replace with actual image path
      location: 'Amboseli National Park',
      duration: '2 Days',
      rating: 4.5,
      price: 800,
      details: 'Amboseli Elephants and Mountain',
    },
    {
      id: 9, // Sandy White Beach Experience
      title: 'Diani Beach',
      image: '/images/diani_beach.jpg', // Replace with actual image path
      location: 'Diani Beach',
      duration: '5 Days',
      rating: 4.8,
      price: 1500,
      details: 'Sandy White Beach Experience',
    },
  ]);
  const [featuredAccommodations, setFeaturedAccommodations] = useState([]);
  const [testimonials, setTestimonials] = useState([
    {
      name: 'Sarah Johnson',
      location: 'United States',
      comment: 'An unforgettable experience! The guides were knowledgeable and friendly, making our safari truly special.',
      rating: 5,
      image: '/images/testimonial1.jpg',
    },
    {
      name: 'David Chen',
      location: 'Canada',
      comment: 'Exceptional service from start to finish. We saw all the Big Five and stayed in amazing lodges.',
      rating: 5,
      image: '/images/testimonial2.jpg',
    },
    {
      name: 'Emma Thompson',
      location: 'UK',
      comment: 'The attention to detail and personalized service made this safari exceed all our expectations.',
      rating: 5,
      image: '/images/testimonial3.jpg',
    },
  ]);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);


  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/home/');
        setHomeData(response.data[0]);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    const fetchFeaturedSafaris = async () => {
      // You can fetch real featured safaris here from an API if available
      // For now, it uses static data
    };

    const fetchFeaturedAccommodations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accommodations/featured/');
        setFeaturedAccommodations(response.data);
      } catch (error) {
        console.error('Error fetching featured accommodations:', error);
      }
    };

    // Assuming you have an API endpoint for testimonials or use static data
    const fetchTestimonials = async () => {
      // try {
      //   const response = await axios.get('http://localhost:8000/api/testimonials/');
      //   setTestimonials(response.data);
      // } catch (error) {
      //   console.error('Error fetching testimonials:', error);
      // }
    };

    fetchHomeData();
    fetchFeaturedSafaris();
    fetchFeaturedAccommodations();
    fetchTestimonials(); // Call testimonial fetch
  }, []);

  const faqs = [
    {
      question: 'What is included in a typical safari package?',
      answer: 'Our packages include accommodation, meals, park fees, game drives, and a professional guide. Some packages may include transfers and special activities.'
    },
    {
      question: 'Is it safe to go on safari in Kenya?',
      answer: 'Yes! Your safety is our top priority. We use well-maintained vehicles, experienced guides, and follow all local safety guidelines.'
    },
    {
      question: 'Can I customize my safari experience?',
      answer: 'Absolutely! We offer tailor-made safaris to match your interests, schedule, and budget.'
    },
    {
      question: 'What should I pack for my safari?',
      answer: 'We recommend comfortable clothing, a hat, sunscreen, binoculars, a camera, and any personal medications.'
    }
  ];

  return (
    <>
      {/* Merged Personalized Hero Section */}
        <Box
          sx={{
          width: '100%',
          minHeight: { xs: 220, md: 400 },
              display: 'flex',
              flexDirection: 'column',
          alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
          overflow: 'hidden',
          mb: { xs: 4, md: 8 },
          background: 'linear-gradient(120deg, #f9d423 0%, #ff4e50 100%)',
          px: { xs: 1, md: 0 },
        }}
      >
        {/* Animated sunrise or wildlife silhouettes (SVG) */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1 }}>
          <svg width="100%" height="80" viewBox="0 0 800 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <ellipse cx="400" cy="80" rx="400" ry="40" fill="#FFD700" fillOpacity="0.2" />
            {/* Simple wildlife silhouettes */}
            <rect x="120" y="60" width="40" height="20" rx="8" fill="#333" opacity="0.2" /> {/* Elephant */}
            <rect x="200" y="65" width="30" height="15" rx="6" fill="#333" opacity="0.18" /> {/* Lion */}
            <rect x="600" y="70" width="25" height="10" rx="5" fill="#333" opacity="0.15" /> {/* Gazelle */}
          </svg>
        </Box>
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', mt: 6 }}>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 16px rgba(0,0,0,0.18)' }}>
            {username
              ? `Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}!`
              : 'Welcome to Solvo Tours and Safaris!'}
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mt: 2, textShadow: '0 1px 8px rgba(0,0,0,0.12)' }}>
            Book Your Dream Safari in Africa
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 400, mt: 2, mb: 4, textShadow: '0 1px 8px rgba(0,0,0,0.10)' }}>
            Experience the wonders of Kenya's wildlife, landscapes, and culture with Solvo Tours and Safaris.
            </Typography>
              <Button
                variant="contained"
            color="secondary"
                size="large"
            sx={{ fontWeight: 700, fontSize: 20, px: 4, py: 1.5, borderRadius: 3, boxShadow: 3, transition: 'transform 0.15s', '&:hover, &:focus': { transform: 'scale(1.08)', boxShadow: 6 } }}
            onClick={handleScrollToFeatured}
            aria-label="Start planning your trip"
          >
            Start Planning Your Trip
              </Button>
            </Box>
      </Box>

      {/* Animated Counters with Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 6 }, my: { xs: 2, md: 6 }, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mx: 2 }}>
          <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <AnimatedCounter end={2500} label="Happy Travelers" />
        </Box>
        <Box sx={{ textAlign: 'center', mx: 2 }}>
          <SafariIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
          <AnimatedCounter end={180} label="Safaris Completed" />
        </Box>
        <Box sx={{ textAlign: 'center', mx: 2 }}>
          <TimelineIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
          <AnimatedCounter end={12} label="Years of Experience" />
        </Box>
      </Box>

      {/* Featured Safaris Section */}
      <Box ref={featuredSafarisRef} sx={{ py: { xs: 3, md: 8 }, bgcolor: '#f7fafc' }}>
        <Container id="featured-safaris">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 4 }}>
          Featured Safaris
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Explore our most popular safari experiences
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {featuredSafaris.map((safari) => (
            <Grid item key={safari.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  },
                  mb: { xs: 2, md: 0 },
                }}
              >
                <CardMedia
                  component="img"
                  height={window.innerWidth < 600 ? 160 : 240}
                  image={safari.image}
                  alt={safari.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {safari.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {safari.location}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <AccessTime sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {safari.duration}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Star sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {safari.rating} Rating
                    </Typography>
                  </Box>
                  <CardActions sx={{ justifyContent: 'flex-end', pr: 0 }}>
                    <Button size="small" component={Link} to={`/safaris/${safari.id}`}>
                      View Details
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ fontWeight: 600, borderRadius: 3, px: 4, py: 1.5, boxShadow: 2, '&:hover': { bgcolor: 'primary.light' } }}
              href="/safaris"
            >
              View All Safaris
            </Button>
          </Box>
      </Container>
      </Box>

      {/* Featured Accommodations Section */}
      <Container sx={{ py: { xs: 3, md: 8 } }}>
        <Typography variant="h3" align="center" gutterBottom>
          Our Favourite Places to Stay
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Discover our top-rated lodges, camps, and hotels.
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {featuredAccommodations.slice(0, 6).map((accommodation) => (
            <Grid item key={accommodation.id} xs={12} sm={6} md={4}>
              <StyledCard sx={{ mb: { xs: 2, md: 0 } }}>
                <CardMedia
                  component="img"
                  height={window.innerWidth < 600 ? 120 : 240}
                  image={accommodation.image}
                  alt={accommodation.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
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
                    {accommodation.description.substring(0, 100)}...
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
        {featuredAccommodations.length > 6 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              component={Link}
              to="/accommodations"
              variant="outlined"
              color="primary"
              size="large"
            >
              View More Accommodations
            </Button>
          </Box>
        )}
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ py: { xs: 2, md: 8 }, bgcolor: 'secondary.light', mt: { xs: 4, md: 8 }, position: 'relative' }}>
        {/* Wave Divider */}
        <Box sx={{ position: 'absolute', top: -40, left: 0, width: '100%', zIndex: 1 }}>
          <Wave fill="#f7fafc" paused={false} options={{ height: 20, amplitude: 20, speed: 0.2, points: 3 }} style={{ minHeight: 40 }} />
        </Box>
        <Container sx={{ position: 'relative', zIndex: 2, pt: 8 }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 4 }}>
            Why Choose Us
        </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[{
              icon: <CheckCircleIcon sx={{ fontSize: 36, color: 'white' }} />, bg: 'success.main', title: 'Expert Guides', desc: 'Our guides are experienced, knowledgeable, and passionate about Africa.'
            }, {
              icon: <SecurityIconMUI sx={{ fontSize: 36, color: 'white' }} />, bg: 'primary.main', title: 'Safe & Secure', desc: 'Your safety and comfort are our top priorities, from booking to safari.'
            }, {
              icon: <SupportAgentIcon sx={{ fontSize: 36, color: 'white' }} />, bg: 'secondary.main', title: '24/7 Support', desc: 'We’re here for you before, during, and after your adventure.'
            }, {
              icon: <EmojiEventsIcon sx={{ fontSize: 36, color: 'white' }} />, bg: 'warning.main', title: 'Award-Winning Service', desc: 'Recognized for excellence in customer satisfaction and unique safari experiences.'
            }, {
              icon: <LocalDiningIcon sx={{ fontSize: 36, color: 'white' }} />, bg: 'success.light', title: 'Gourmet Meals', desc: 'Enjoy delicious, locally inspired cuisine on every safari adventure.'
            }].map((item, i) => (
              <Grid item xs={12} sm={6} md={2.4} key={i}>
                <Box
                      sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                        boxShadow: 2,
                    bgcolor: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.04)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{
                    width: 64, height: 64, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', bgcolor: item.bg, boxShadow: 3, transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.15)' }
                  }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                  </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      {/* FAQ Accordion Section */}
      <Box sx={{ py: { xs: 3, md: 8 }, bgcolor: '#f7fafc' }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, i) => (
            <Accordion key={i} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Trust Badges Row */}
      <Box sx={{ py: { xs: 3, md: 8 }, bgcolor: 'white', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <Container sx={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <SecurityIconMUI color="primary" />
            <Typography variant="body2">Secure Payment</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon color="success" />
            <Typography variant="body2">Verified Operator</Typography>
              </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <SupportAgentIcon color="secondary" />
            <Typography variant="body2">24/7 Support</Typography>
              </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon color="warning" />
            <Typography variant="body2">Award-Winning</Typography>
              </Box>
        </Container>
              </Box>

      {/* Testimonials Carousel with Creative Heading and Subtle Background */}
      <Box sx={{ py: { xs: 3, md: 8 }, bgcolor: '#f9f9f9', mt: { xs: 4, md: 8 } }}>
        <Container>
          <TestimonialsCarousel />
        </Container>
      </Box>

      {/* Newsletter Signup Section */}
      <Box sx={{ py: { xs: 2, md: 6 }, bgcolor: 'primary.light', mt: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2 }}>
            Stay in the Loop
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
            Subscribe to our newsletter for the latest safari deals, tips, and stories.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Your email"
              sx={{ bgcolor: 'white', borderRadius: 2, flex: 1 }}
              InputProps={{ endAdornment: <InputAdornment position="end">@</InputAdornment> }}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 600, borderRadius: 2, px: 4, boxShadow: 2, '&:hover': { bgcolor: 'secondary.dark' } }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Payment Methods Section */}
      <Box sx={{ py: { xs: 3, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ color: '#6f4e37', fontWeight: 500 }}>
            We Accept Online Payments
          </Typography>
          <Box sx={{ width: 80, height: 2, bgcolor: '#6f4e37', mx: 'auto', mb: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <img src="/images/visa.png" alt="Visa" style={{ height: 50 }} />
            <img src="/images/mastercard.png" alt="Mastercard" style={{ height: 50 }} />
            <img src="/images/american-express.png" alt="American Express" style={{ height: 50 }} />
            <img src="/images/pesapal.webp" alt="Pesapal" style={{ height: 50 }} />
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ bgcolor: 'primary.main', py: { xs: 3, md: 8 }, textAlign: 'center', color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            Ready for Your Safari Adventure?
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Book your dream safari today and experience the wonders of Kenya's wildlife
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#FFA500',
              '&:hover': { bgcolor: '#FF8C00' },
              color: 'white',
            }}
            component={Link}
            to="/safaris"
          >
            Start Planning Your Trip
          </Button>
        </Container>
      </Box>
      <SafariMap />
    </>
  );
}

export default Home; 