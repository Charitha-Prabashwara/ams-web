import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid
} from '@mui/material';

const EditBatchDialog = ({
  open,
  batch,
  onChange,
  onSave,
  onDelete,
  onClose
}) => {
  const [localBatch, setLocalBatch] = useState(null);

  useEffect(() => {
    if (open && batch) {
      setLocalBatch(batch);
    }
  }, [open, batch]);

  if (!localBatch) return null;

  const handleFieldChange = (field) => (e) => {
    const updated = { ...localBatch, [field]: e.target.value };
    setLocalBatch(updated);
    onChange?.(updated);
  };

  const handleAcademicChange = (field) => (e) => {
    const updated = {
      ...localBatch,
      academic: {
        ...localBatch.academic,
        [field]: e.target.value
      }
    };
    setLocalBatch(updated);
    onChange?.(updated);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Edit Batch</DialogTitle>

      <DialogContent dividers>
        <Typography fontWeight="bold">Batch Name</Typography>
        <TextField
          fullWidth
          value={localBatch.name || ''}
          onChange={handleFieldChange('name')}
        />

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Typography fontWeight="bold">Lower Bound</Typography>
            <TextField
              type="number"
              fullWidth
              value={localBatch.academic?.lb || ''}
              onChange={handleAcademicChange('lb')}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">Upper Bound</Typography>
            <TextField
              type="number"
              fullWidth
              value={localBatch.academic?.ub || ''}
              onChange={handleAcademicChange('ub')}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {onDelete && (
          <Button color="error" onClick={() => onDelete(localBatch)}>
            Delete
          </Button>
        )}
        <Button variant="contained" onClick={() => onSave(localBatch)}>
          Save
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBatchDialog;
