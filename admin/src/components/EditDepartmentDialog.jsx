import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Grid, Box } from '@mui/material';

const EditDepartmentDialog = ({ open, onClose, onSave, onDelete, department, setDepartment }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Department</DialogTitle>

      <DialogContent dividers>
        {department && (
          <>
            {/* Short name & Key */}
            <Grid container spacing={2} mt={1}>
              <Grid item xs={8}>
                <Typography fontWeight="bold">Short Name</Typography>
                <TextField
                  fullWidth
                  value={department.name.short}
                  inputProps={{ maxLength: 30 }}
                  onChange={(e) =>
                    setDepartment({
                      ...department,
                      name: { ...department.name, short: e.target.value }
                    })
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <Typography fontWeight="bold" align="right">
                  Key
                </Typography>
                <TextField
                  fullWidth
                  value={department.name.key}
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) =>
                    setDepartment({
                      ...department,
                      name: { ...department.name, key: e.target.value }
                    })
                  }
                />
              </Grid>
            </Grid>

            {/* Full name */}
            <Box mt={3}>
              <Typography fontWeight="bold">Full Name</Typography>
              <TextField
                fullWidth
                value={department.name.long}
                onChange={(e) =>
                  setDepartment({
                    ...department,
                    name: { ...department.name, long: e.target.value }
                  })
                }
              />
            </Box>

            {/* Description */}
            <Box mt={3}>
              <Typography fontWeight="bold">Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={department.description || ''}
                onChange={(e) =>
                  setDepartment({
                    ...department,
                    description: e.target.value
                  })
                }
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDepartmentDialog;
