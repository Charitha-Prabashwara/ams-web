import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

const LoadingErrorWrapper = ({ isLoading, isError }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    let timer;
    if (isError) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(10); // reset if no error
    }

    return () => clearInterval(timer);
  }, [isError]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        gap={3}
        textAlign="center"
        px={2}
      >
        <Typography color="error" variant="h4" fontWeight="bold">
          Failed to load data
        </Typography>

        <Typography color="textSecondary" variant="h6">
          Reloading in {countdown} second{countdown !== 1 ? 's' : ''}
        </Typography>

        <Button variant="contained" color="error" size="large" onClick={() => window.location.reload()}>
          Reload Now
        </Button>
      </Box>
    );
  }

  return null;
};

export default LoadingErrorWrapper;
