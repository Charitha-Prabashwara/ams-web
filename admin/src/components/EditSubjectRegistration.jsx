// EditSubjectRegistration.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from '@mui/material';

export default function EditSubjectRegistration({
  open,
  onClose,
  students,
  subjects,
  semesters,
  registration,
  setRegistration,
  onSave,
  onDelete
}) {
  if (!registration) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Subject Registration</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* STUDENT */}
          <TextField
            select
            label="Student"
            value={registration.student?._id || ''}
            onChange={(e) =>
              setRegistration({
                ...registration,
                student: e.target.value
              })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.registration_id} | {s.name?.full_name}
              </option>
            ))}
          </TextField>

          {/* SEMESTER */}
          <TextField
            select
            label="Semester"
            value={registration.semester?._id || ''}
            onChange={(e) =>
              setRegistration({
                ...registration,
                semester: e.target.value
              })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.name}
              </option>
            ))}
          </TextField>

          {/* SUBJECT */}
          <TextField
            select
            label="Subject"
            value={registration.subject?._id || ''}
            onChange={(e) =>
              setRegistration({
                ...registration,
                subject: e.target.value
              })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} | {sub.name}
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
