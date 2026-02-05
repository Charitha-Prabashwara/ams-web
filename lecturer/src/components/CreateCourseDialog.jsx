import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  MenuItem
} from '@mui/material';

const CreateCourseDialog = ({
  open,
  onClose,
  onSave,
  course,
  setCourse,
  departments
}) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Course</DialogTitle>

      <DialogContent dividers>
        {/* Code & Name */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          mb={2}
        >
          <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
            <Typography fontWeight="bold">Course Code</Typography>
            <TextField
              fullWidth
              placeholder="Ex: IT101"
              value={course.code}
              inputProps={{ maxLength: 15 }}
              onChange={(e) =>
                setCourse({
                  ...course,
                  code: e.target.value.toUpperCase()
                })
              }
            />
          </Box>

          <Box flex="1">
            <Typography fontWeight="bold">Course Name</Typography>
            <TextField
              fullWidth
              placeholder="Ex: Introduction to IT"
              value={course.name}
              inputProps={{ maxLength: 150 }}
              onChange={(e) =>
                setCourse({
                  ...course,
                  name: e.target.value
                })
              }
            />
          </Box>
        </Box>

        {/* Department */}
        <Box mt={2}>
          <Typography fontWeight="bold">Department</Typography>
          <TextField
            select
            fullWidth
            value={course.department}
            onChange={(e) =>
              setCourse({
                ...course,
                department: e.target.value
              })
            }
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name.long}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCourseDialog;
