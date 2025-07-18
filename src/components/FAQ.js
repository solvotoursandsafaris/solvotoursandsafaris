import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const faqs = [
    {
      question: "What is the best time to go on a safari?",
      answer: "The best time to visit is during the dry season, from June to October, when wildlife is more active."
    },
    {
      question: "What should I pack for a safari?",
      answer: "We recommend bringing comfortable clothing, sunscreen, a hat, and a good camera to capture the moments."
    },
    {
      question: "Are the safaris family-friendly?",
      answer: "Yes, we offer family-friendly safari packages that cater to all ages."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel your booking up to 48 hours in advance for a full refund. Please check our website for more details."
    },
    {
      question: "Do you provide meals during the safari?",
      answer: "Yes, meals are included in most of our safari packages. Please check the specific package details for more information."
    },
  ];

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
