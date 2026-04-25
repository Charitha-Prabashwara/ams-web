// EditLecturerSubjectRegistration.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button } from '@mui/material';

export default function EditLecturerSubjectRegistration({
  open,
  onClose,
  lecturers = [],
  subjects = [],
  registration = { lecturer: '', subject: '' },
  setRegistration,
  onSave,
  onDelete
}) {
  setRegistration.lecturer = registration?.lecturer?._id;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Registration</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* <TextField
            select
            label="Lecturer"
            value={registration?.lecturer?._id}
            onChange={(e) => {
              setRegistration({ ...registration, lecturer: e.target.value })
          }}
            
            
          >
            
            {lecturers.map(l => (
              <option key={l.id} value={l.id}>{l?.name?.full_name}</option>
            ))}
          </TextField> */}

          {/* Lecturer - Textbox (Auto Loaded) */}
          <TextField label="Lecturer" value={registration?.lecturer?.name?.full_name || ''} disabled fullWidth />

          <TextField
            select
            label="Subject"
            value={registration.subject._id}
            onChange={(e) => setRegistration({ ...registration, subject: e.target.value })}
            SelectProps={{ native: true }}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="success" onClick={onSave}>
          Save
        </Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
