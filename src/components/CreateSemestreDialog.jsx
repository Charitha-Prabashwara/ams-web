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
  MenuItem,
  Backdrop,
  CircularProgress
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
  isLoadingDepartments = false,
  isLoadingCourses = false,
  isLoadingBatches = false,
  onDepartmentChange
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ position: 'center' }}
    >
      <DialogTitle>Create New Semester</DialogTitle>

      {/* ================= DIALOG CONTENT ================= */}
      <DialogContent
        dividers
        sx={{
          filter: isLoadingCourses ? 'blur(3px)' : 'none',
          pointerEvents: isLoadingCourses ? 'none' : 'auto',
          transition: 'filter 0.2s ease'
        }}
      >
        {/* ================= ROW 1: CODE + NAME ================= */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
            <Typography fontWeight="bold">Code</Typography>
            <TextField
              fullWidth
              placeholder="SEM2522"
              value={semester.code}
              onChange={(e) =>
                setSemester({ ...semester, code: e.target.value })
              }
            />
          </Box>

          <Box flex={{ xs: '1 1 100%', sm: 1 }}>
            <Typography fontWeight="bold">Name</Typography>
            <TextField
              fullWidth
              placeholder="Second Semester"
              value={semester.name}
              onChange={(e) =>
                setSemester({ ...semester, name: e.target.value })
              }
            />
          </Box>
        </Box>

        {/* ================= ROW 2 ================= */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          {/* DEPARTMENT */}
          <Box flex={{ xs: '1 1 100%', sm: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                value={semester.department}
                disabled={isLoadingDepartments}
                onChange={(e) => {
                  const departmentId = e.target.value;

                  setSemester({
                    ...semester,
                    department: departmentId,
                    course: ''
                  });

                  onDepartmentChange?.(departmentId);
                }}
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
                disabled={!semester.department || isLoadingCourses || courses.length==0}
                onChange={(e) =>
                  setSemester({ ...semester, course: e.target.value })
                }
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
                disabled={isLoadingBatches}
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

      {/* ================= ACTIONS ================= */}
      <DialogActions>
        <Button onClick={onClose} disabled={isLoadingCourses}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isLoadingCourses||isLoadingBatches || isLoadingDepartments}
        >
          Save
        </Button>
      </DialogActions>

      {/* ================= LOADER OVERLAY ================= */}
      <Backdrop
        open={isLoadingCourses || isLoadingDepartments || isLoadingBatches}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.dialog + 1,
          color: '#fff'
        }}
      >
        <CircularProgress />
      </Backdrop>
    </Dialog>
  );
};

export default CreateSemesterDialog;
