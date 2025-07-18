import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, TextField, InputAdornment, Button, Box } from '@mui/material';
import Send from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
  '&:hover, &:focus-within': {
    transform: 'translateY(-8px) scale(1.04)',
    boxShadow: theme.shadows[6],
    outline: '2px solid #FFA000',
    outlineOffset: 2,
  },
}));

const [newsletterSuccess, setNewsletterSuccess] = useState(false);

const handleNewsletterSubmit = (e) => {
  e.preventDefault();
  setNewsletterSuccess(true);
  setTimeout(() => setNewsletterSuccess(false), 2000);
};

<Box component="form" onSubmit={handleNewsletterSubmit} sx={{ display: 'flex', gap: 1, mb: 1 }}>
  <TextField
    variant="filled"
    size="small"
    placeholder="Your email"
    value={newsletterEmail}
    onChange={e => setNewsletterEmail(e.target.value)}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Button type="submit" color="secondary" variant="contained" size="small" sx={{ minWidth: 0, px: 1.5, transition: 'transform 0.15s', '&:hover, &:focus': { transform: 'scale(1.08)', boxShadow: 3 } }}>
            <Send fontSize="small" />
          </Button>
        </InputAdornment>
      ),
      disableUnderline: true,
      sx: { bgcolor: 'white', borderRadius: 1, fontSize: 14 }
    }}
    sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
    required
    type="email"
    aria-label="Newsletter email"
  />
  {newsletterSuccess && (
    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32, ml: 1, animation: 'pop 0.5s' }} />
  )}
</Box>

<style>{`
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
`}</style>