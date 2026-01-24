// CreateSubjectRegistration.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField
} from '@mui/material';

export default function CreateSubjectRegistration({
  open,
  onClose,
  students,
  subjects,
  semesters,
  registration,
  setRegistration,
  onRegisterClick
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Subject Registration</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* STUDENT */}
          <TextField
            select
            label="Student"
            value={registration.student}
            onChange={(e) =>
              setRegistration({ ...registration, student: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            
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
            value={registration.semester}
            onChange={(e) =>
              setRegistration({ ...registration, semester: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            
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
            value={registration.subject}
            onChange={(e) =>
              setRegistration({ ...registration, subject: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            
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
        <Button
          variant="contained"
          color="success"
          onClick={onRegisterClick}
          disabled={
            !registration.student ||
            !registration.subject ||
            !registration.semester
          }
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}
