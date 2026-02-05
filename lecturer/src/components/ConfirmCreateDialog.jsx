import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Button } from '@mui/material';

const ConfirmCreateDialog = ({
  open,
  onClose,
  onConfirm,
  confirmText, // text user must type (eg: full name)
  inputValue,
  onInputChange,
  title = 'Confirm Create',
  confirmLabel = 'Confirm Create'
}) => {
  const isMatch = inputValue === confirmText;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Typography>Please type the following to confirm:</Typography>

        <Typography fontWeight="bold" mt={1} color="primary" sx={{ userSelect: 'none' }}>
          {confirmText}
        </Typography>

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          placeholder="Type exactly here"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          inputProps={{
            autoComplete: 'off',
            spellCheck: false
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="success" variant="contained" disabled={!isMatch} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCreateDialog;
