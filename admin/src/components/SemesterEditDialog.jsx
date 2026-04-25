import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress
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
  onDepartmentChange
}) => {
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
