import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Fade
} from '@mui/material';

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  confirmText,          // text user must type
  inputValue,
  onInputChange,
  title = 'Confirm Delete',
  confirmLabel = 'Confirm Delete'
}) => {
  const isMatch = inputValue === confirmText;

  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
      transitionDuration={200}
      maxWidth={false}
      fullWidth={false}
      sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: '90%' } }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Typography>Type this text to confirm:</Typography>

        <Typography fontWeight="bold" mt={1} color="error"
         sx={{
    userSelect: 'none',        // modern browsers
    WebkitUserSelect: 'none',  // Safari
    MozUserSelect: 'none',     // Firefox
    msUserSelect: 'none'       // IE / old Edge
  }}>
          {confirmText}
        </Typography>

  <TextField
  fullWidth
  autoFocus
  placeholder="Type exactly here"
  value={inputValue}
  onChange={(e) => onInputChange(e.target.value)}
  sx={{ mt: 2 }}
  onPaste={(e) => e.preventDefault()}
  onCopy={(e) => e.preventDefault()}
  onCut={(e) => e.preventDefault()}
  inputProps={{
    autoComplete: 'off',
    spellCheck: false
  }}
/>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          disabled={!isMatch}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
