import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SustainabilityIcon from '../assets/sustainability.svg';
import ExcellenceIcon from '../assets/excellence.svg';
import CommunityIcon from '../assets/community.svg';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StyledSection = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/about/');
        setAboutData(response.data[0]); // Assuming you want the first object
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    const sampleTeamMembers = [
      {
        name: 'Mark Omaiko',
        role: 'Co-Founder & CTO',
        description: 'Mark is passionate about wildlife conservation and has over 5 years of experience in the safari industry. He is the founder of the company and the CTO.',
        image: '/images/team-member1.jpg',
      },
      {
        name: 'Byron Mongare',
        role: 'Co-Founder & Director of Operations',
        description: 'Byron is passionate about wildlife conservation and has over 10 years of experience in the safari industry. He is the founder of the company and the director of operations.',
        image: '/images/team-member2.avif',
      },
      {
        name: 'Jane Mwangi',
        role: 'Director of Marketing',
        description: 'Jane is an expert in African wildlife and loves sharing her knowledge with guests. She is the director of marketing and the head of the marketing team.',
        image: '/images/team-member3.avif',
      },
    ];

    setTeamMembers(sampleTeamMembers);
    fetchAboutData();
  }, []);

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
            About Solvo Tours and Safaris
          </Typography>
          <Typography variant="h5">
            Your Gateway to African Wildlife Adventures. We are a team of passionate individuals who are dedicated to providing you with the best safari experience possible.
          </Typography>
        </Container>
      </Box>

      <Container>
        <StyledSection>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Story
              </Typography>
              <Typography paragraph>
                At Solvo Tours and Safaris, we are driven by a passion for Africa's breathtaking landscapes and wildlife. Founded by Mark Omaiko and Byron Mongare, our mission is to create unforgettable experiences that connect travelers with nature while promoting responsible tourism. Our dedicated team of experienced guides ensures that every safari not only delights but also contributes to the conservation of the environments we explore. Join us on an adventure where every moment creates lasting memories.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/Elephant.avif"
                alt="Elephant"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </StyledSection>

        <StyledSection>
          <Typography variant="h4" gutterBottom align="center">
            Our Mission
          </Typography>
          <Typography paragraph align="center">
            Our mission is to provide exceptional safari experiences that foster a deep appreciation for Africa's wildlife and landscapes while ensuring sustainable practices that benefit local communities.
          </Typography>
        </StyledSection>

        <StyledSection>
          <Typography variant="h4" gutterBottom align="center">
            Why Choose Us
          </Typography>
          <Typography paragraph align="center">
            We offer tailor-made safaris that cater to your preferences, ensuring a personalized experience. Our expert guides are passionate about wildlife and committed to providing you with an unforgettable adventure. We are a team of passionate individuals who are dedicated to providing you with the best safari experience possible.
          </Typography>
        </StyledSection>

        <StyledSection>
          <Typography variant="h4" gutterBottom align="center">
            Meet Our Team
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {teamMembers.map((member) => (
              <Grid item xs={12} md={4} key={member.name}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </StyledSection>

        <StyledSection>
          <Typography variant="h4" gutterBottom align="center">
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Sustainability",
                description: "We are committed to eco-friendly practices and supporting local conservation efforts.",
                icon: SustainabilityIcon,
              },
              {
                title: "Excellence",
                description: "We strive to provide the highest quality safari experiences with attention to every detail.",
                icon: ExcellenceIcon,
              },
              {
                title: "Community",
                description: "We work closely with local communities to ensure tourism benefits everyone.",
                icon: CommunityIcon,
              }
            ].map((value) => (
              <Grid item xs={12} md={4} key={value.title}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box component="img" src={value.icon} alt={value.title} sx={{ width: 60, height: 60, mb: 2 }} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </StyledSection>

        {/* Call to Action Section */}
        <StyledSection>
          <Typography variant="h4" gutterBottom align="center">
            Ready for Your Safari Adventure?
          </Typography>
          <Typography paragraph align="center">
            Contact us today to start planning your trip.
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" component={Link} to="/contact">
              Start planning your trip
            </Button>
          </Box>
        </StyledSection>
      </Container>
    </>
  );
}

export default About;