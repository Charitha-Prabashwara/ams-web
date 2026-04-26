import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

const SemesterEditDialog = ({
  open,
  onClose,
  semester,
  setSemester,
  onSave,
  onDelete,
  departments = [],
  courses = [],
  batches = [],
  loading = false,
  onDepartmentChange,
  courseError = null,
  onReload
}) => {
  // Auto-load courses when editing existing semester
  const prevSemesterIdRef = React.useRef(null);

  React.useEffect(() => {
    if (semester && open && semester.id && prevSemesterIdRef.current !== semester.id) {
      prevSemesterIdRef.current = semester.id;

      // Extract department ID and trigger loading
      const departmentId = semester.department?.id || semester.department?._id || semester.department;
      if (departmentId && onDepartmentChange) {
        onDepartmentChange(departmentId);
      }
    }
  }, [semester, open, onDepartmentChange]);

  if (!semester) return null;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Semester</DialogTitle>

      {/* ===== LOADING BACKDROP ===== */}
      <Backdrop
        open={loading}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#fff'
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <DialogContent
        dividers
        sx={{
          filter: loading ? 'blur(2px)' : 'none',
          pointerEvents: loading ? 'none' : 'auto'
        }}
      >
        {/* CODE + NAME */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="Code"
            value={semester.code || ''}
            onChange={(e) => setSemester({ ...semester, code: e.target.value })}
          />
          <TextField
            fullWidth
            label="Name"
            value={semester.name || ''}
            onChange={(e) => setSemester({ ...semester, name: e.target.value })}
          />
        </Box>

        {/* DEPARTMENT / COURSE / BATCH */}
        <Box display="flex" gap={2}>
          {/* DEPARTMENT */}
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={semester.department?.id || semester.department?._id}
              onChange={(e) => {
                setSemester({ ...semester, department: { ...semester.department, id: e.target.value } });
                onDepartmentChange?.(e.target.value);
              }}
            >
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name.long}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* COURSE */}
          <FormControl fullWidth>
            <InputLabel>Course</InputLabel>
            <Select
              label="Course"
              value={semester.course?.id || semester.course?._id}
              onChange={(e) =>
                setSemester({
                  ...semester,
                  course: {
                    ...semester.course,
                    id: e.target.value
                  }
                })
              }
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* BATCH */}
          <FormControl fullWidth>
            <InputLabel>Batch</InputLabel>
            <Select
              label="Batch"
              value={semester.batch?.id || semester.batch?._id}
              onChange={(e) =>
                setSemester({
                  ...semester,
                  batch: {
                    ...semester.batch,
                    id: e.target.value
                  }
                })
              }
            >
              {batches.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      {/* Reload section for failed data loads */}
      {courseError && onReload && (
        <Box sx={{ px: 3, py: 2, bgcolor: 'error.light', borderTop: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error.contrastText" variant="body2" mb={1}>
            Failed to load courses due to connection issue. Please try again.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={onReload}
            startIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            }
          >
            Reload Courses
          </Button>
        </Box>
      )}

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

export default SemesterEditDialog;
