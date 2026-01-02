// UniversalActionBar.jsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import HelpDrawer from './HelpDrawer';

const UniversalActionBar = ({ buttons = [], helpDrawer = null }) => {
  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp(prev => !prev);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2} flexWrap="wrap" gap={1}>
        {buttons.map((btn, idx) => {
          // If button is of type "help", override click to toggle drawer
          if (btn.type === 'help') {
            return (
              <Button
                key={idx}
                variant={btn.variant || 'contained'}
                color={btn.color || 'primary'}
                onClick={toggleHelp}
                startIcon={btn.icon || null}
              >
                {btn.label}
              </Button>
            );
          }

          return (
            <Button
              key={idx}
              variant={btn.variant || 'contained'}
              color={btn.color || 'primary'}
              onClick={btn.onClick || (() => {})}
              startIcon={btn.icon || null}
            >
              {btn.label}
            </Button>
          );
        })}
      </Box>

      {/* Render HelpDrawer if provided */}
      {helpDrawer && (
        <HelpDrawer
          open={openHelp}
          onClose={toggleHelp}
          sections={helpDrawer.sections}
          title={helpDrawer.title}
        />
      )}
    </>
  );
};

export default UniversalActionBar;
