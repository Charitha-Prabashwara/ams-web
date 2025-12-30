import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton
} from '@mui/material';

const HelpDrawer = ({ open, onClose, sections = [], title = "Help" }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: { width: { xs: '80%', sm: 400 }, p: 2 }
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose}>✖</IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ overflowY: 'auto', height: '100%', p: 2 }}>
        {sections.map((section, index) => (
          <Box key={index} mb={2}>
            <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
              {section.title}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
              {section.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};

export default HelpDrawer;
