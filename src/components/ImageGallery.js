import React, { useState } from 'react';
import {
  Box,
  Modal,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import OptimizedImage from './OptimizedImage';

function ImageGallery({ images }) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setOpen(true);
            }}
          >
            <OptimizedImage
              src={image.url}
              alt={image.alt}
              sx={{
                height: 240,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                borderRadius: 1,
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: -40,
              top: -40,
              color: 'white',
            }}
          >
            <Close />
          </IconButton>

          <OptimizedImage
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt}
            sx={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />

          {!isMobile && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                }}
              >
                <ArrowBack />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                }}
              >
                <ArrowForward />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ImageGallery; 