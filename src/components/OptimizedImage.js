import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';

function OptimizedImage({ src, alt, sizes, sx = {}, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {!loaded && !error && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
}

export default OptimizedImage; 