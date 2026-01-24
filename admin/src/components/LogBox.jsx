import React from 'react';
import { Box, Typography } from '@mui/material';

const LogBox = ({ title = 'Log / Debug Data', logs = [], height = 200 }) => {
  return (
    <Box
      mt={3}
      p={2}
      border="1px solid #ddd"
      borderRadius={0}
      bgcolor="#f5f5f5"
      sx={{
        height,
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: 14,
        whiteSpace: 'pre-wrap'
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>

      {logs.length === 0 ? (
        <Typography color="text.secondary">No logs available.</Typography>
      ) : (
        logs.map((log, index) => <Typography key={index}>{log}</Typography>)
      )}
    </Box>
  );
};

export default LogBox;
