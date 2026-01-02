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

const CreateDepartmentDialog = ({
  open,
  onClose,
  department,
  setDepartment,
  onSave
}) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Create New Department</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={8}>
            <Typography fontWeight="bold">Short Name (max 30)</Typography>
            <TextField
              fullWidth
              value={department.shortName}
              inputProps={{ maxLength: 30 }}
              placeholder="Ex: IT"
              onChange={(e) =>
                setDepartment({ ...department, shortName: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={4}>
            <Typography fontWeight="bold" align="right">
              Key (max 10)
            </Typography>
            <TextField
              fullWidth
              value={department.keyName}
              inputProps={{ maxLength: 10 }}
              placeholder="Ex: INF"
              onChange={(e) =>
                setDepartment({ ...department, keyName: e.target.value })
              }
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography fontWeight="bold">Full Name (max 100)</Typography>
          <TextField
            fullWidth
            value={department.fullName}
            inputProps={{ maxLength: 100 }}
            placeholder="Ex: Information Technology"
            onChange={(e) =>
              setDepartment({ ...department, fullName: e.target.value })
            }
          />
        </Box>

        <Box mt={3}>
          <Typography fontWeight="bold">Description (max 2000)</Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={department.description}
            inputProps={{ maxLength: 2000 }}
            placeholder="Enter department description..."
            onChange={(e) =>
              setDepartment({ ...department, description: e.target.value })
            }
          />
        </Box>
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

export default CreateDepartmentDialog;
