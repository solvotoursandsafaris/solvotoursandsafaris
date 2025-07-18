import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';

const tips = [
  "Did you know? The Masai Mara is home to the Great Migration!",
  "Tip: Bring binoculars for the best wildlife viewing.",
  "Fun fact: Elephants are the largest land animals on Earth!",
  "Stay hydrated and wear sunscreen on your safari adventure.",
  "Lions can sleep up to 20 hours a day!"
];

export default function Mascot() {
  const [tipIndex, setTipIndex] = useState(0);
  const [wave, setWave] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 7000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWave(true);
      setTimeout(() => setWave(false), 1200);
    }, 10000);
    return () => clearInterval(waveInterval);
  }, []);

  // Show for 10s, hide for 60s, repeat
  useEffect(() => {
    let hideTimeout, showTimeout;
    if (visible) {
      hideTimeout = setTimeout(() => setVisible(false), 15000);
    } else {
      showTimeout = setTimeout(() => setVisible(true), 70000);
    }
    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 80, sm: 40 },
        left: { xs: 10, sm: 40 },
        zIndex: 1201,
        display: 'flex',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
      aria-label="Safari mascot"
      role="img"
    >
      {/* Lion SVG with waving paw */}
      <Box sx={{ position: 'relative', width: 80, height: 80, mr: 1, pointerEvents: 'auto' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" fill="#FFD700" stroke="#B8860B" strokeWidth="4" />
          {/* Face */}
          <ellipse cx="40" cy="45" rx="18" ry="20" fill="#FFF8DC" />
          {/* Eyes */}
          <ellipse cx="33" cy="45" rx="2.5" ry="3.5" fill="#333" />
          <ellipse cx="47" cy="45" rx="2.5" ry="3.5" fill="#333" />
          {/* Nose */}
          <ellipse cx="40" cy="54" rx="3" ry="2" fill="#B8860B" />
          {/* Smile */}
          <path d="M36 58 Q40 62 44 58" stroke="#B8860B" strokeWidth="2" fill="none" />
          {/* Left Paw (waving) */}
          <g style={{ transformOrigin: '20px 60px', transform: wave ? 'rotate(-30deg)' : 'rotate(0deg)', transition: 'transform 0.5s' }}>
            <ellipse cx="20" cy="60" rx="7" ry="10" fill="#FFF8DC" stroke="#B8860B" strokeWidth="2" />
            <ellipse cx="20" cy="67" rx="2" ry="2.5" fill="#B8860B" />
          </g>
          {/* Right Paw */}
          <ellipse cx="60" cy="60" rx="7" ry="10" fill="#FFF8DC" stroke="#B8860B" strokeWidth="2" />
          <ellipse cx="60" cy="67" rx="2" ry="2.5" fill="#B8860B" />
        </svg>
      </Box>
      {/* Speech bubble */}
      <Box sx={{ bgcolor: 'white', color: 'primary.main', px: 2, py: 1, borderRadius: 3, boxShadow: 3, minWidth: 180, pointerEvents: 'auto', mb: 4 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{tips[tipIndex]}</Typography>
      </Box>
    </Box>
  );
} 