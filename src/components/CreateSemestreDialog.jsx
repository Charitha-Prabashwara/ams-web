import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const CreateSemesterDialog = ({
  open,
  onClose,
  onSubmit,
  semester,
  setSemester,
  departments = [],
  courses = [],
  batches = [],
  isLoadingDepartments,
  isLoadingCourses,
  isLoadingBatches
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Semester</DialogTitle>

      <DialogContent dividers>
        {/* ================= ROW 1: CODE + NAME ================= */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {/* CODE */}
          <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
            <Typography fontWeight="bold">Code</Typography>
            <TextField
              fullWidth
              placeholder="Ex: SEM2522"
              value={semester.code}
              onChange={(e) =>
                setSemester({ ...semester, code: e.target.value })
              }
            />
          </Box>

          {/* NAME */}
          <Box flex={{ xs: '1 1 100%', sm: 1 }}>
            <Typography fontWeight="bold">Name</Typography>
            <TextField
              fullWidth
              placeholder="Ex: Second semester of..."
              value={semester.name}
              onChange={(e) =>
                setSemester({ ...semester, name: e.target.value })
              }
            />
          </Box>
        </Box>

        {/* ================= ROW 2: DEPARTMENT / COURSE / BATCH ================= */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          {/* DEPARTMENT */}
          <Box flex={{ xs: '1 1 100%', sm: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                label="Select a department"
                value={semester.department}
                onChange={(e) =>
                  setSemester({ ...semester, department: e.target.value })
                }
                disabled={isLoadingDepartments}
              >
                {departments.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name.long}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* COURSE */}
          <Box flex={{ xs: '1 1 100%', sm: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                label="Course"
                value={semester.course}
                onChange={(e) =>
                  setSemester({ ...semester, course: e.target.value })
                }
                disabled={isLoadingCourses}
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* BATCH */}
          <Box flex={{ xs: '1 1 100%', sm: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Batch</InputLabel>
              <Select
                label="Batch"
                value={semester.batch}
                onChange={(e) =>
                  setSemester({ ...semester, batch: e.target.value })
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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSemesterDialog;
