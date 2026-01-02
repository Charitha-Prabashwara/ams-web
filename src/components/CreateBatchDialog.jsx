import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Box
} from '@mui/material';

const CreateBatchDialog = ({
  open,
  onClose,
  batch,
  setBatch,
  onSave
}) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Create New Batch</DialogTitle>

      <DialogContent dividers>
        <Box mt={1}>
          <Typography fontWeight="bold">Batch Name</Typography>
          <TextField
            fullWidth
            value={batch.name}
            onChange={(e) =>
              setBatch({ ...batch, name: e.target.value })
            }
          />
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Typography fontWeight="bold">Lower Bound (Year)</Typography>
            <TextField
              type="number"
              fullWidth
              value={batch.lb}
              onChange={(e) =>
                setBatch({ ...batch, lb: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">Upper Bound (Year)</Typography>
            <TextField
              type="number"
              fullWidth
              value={batch.ub}
              onChange={(e) =>
                setBatch({ ...batch, ub: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBatchDialog;
