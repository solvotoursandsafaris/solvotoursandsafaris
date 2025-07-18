import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ImageDisplay = ({ 
  src, 
  alt, 
  height = 300, 
  aspectRatio = '16/9',
  fallbackSrc = '/images/placeholder.jpg',
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius: 1,
        aspectRatio,
        ...props.sx
      }}
    >
      {loading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}
      <StyledImage
        src={error ? fallbackSrc : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        sx={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </Box>
  );
};

export default ImageDisplay; 