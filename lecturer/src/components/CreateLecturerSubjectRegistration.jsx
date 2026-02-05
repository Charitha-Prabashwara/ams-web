// CreateLecturerSubjectRegistration.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button
} from '@mui/material';

export default function CreateLecturerSubjectRegistration({
  open,
  onClose,
  lecturers = [],
  subjects = [],
  registration = { lecturer: '', subject: '' },
  setRegistration,
  onRegisterClick
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Lecturer Subject Registration</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Lecturer Dropdown */}
          <TextField
            select
            label="Lecturer"
            value={registration.lecturer}
            onChange={e =>
              setRegistration({ ...registration, lecturer: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">Select Lecturer</option>
            {lecturers.map(l => (
              <option key={l.id} value={l.id}>
                {l.registration_id} | {l.name?.full_name}
              </option>
            ))}
          </TextField>

          {/* Subject Dropdown */}
          <TextField
            select
            label="Subject"
            value={registration.subject}
            onChange={e =>
              setRegistration({ ...registration, subject: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </TextField>

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          onClick={onRegisterClick}
          disabled={!registration.lecturer || !registration.subject}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}