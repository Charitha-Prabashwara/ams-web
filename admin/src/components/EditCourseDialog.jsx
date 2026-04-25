import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, MenuItem } from '@mui/material';

const EditCourseDialog = ({ open, onClose, onSave, onDelete, course, setCourse, departments }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Course</DialogTitle>

      <DialogContent dividers>
        {course && (
          <>
            {/* Code & Name */}
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
              <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
                <Typography fontWeight="bold">Code</Typography>
                <TextField fullWidth value={course.code} onChange={(e) => setCourse({ ...course, code: e.target.value.toUpperCase() })} />
              </Box>

              <Box flex="1">
                <Typography fontWeight="bold">Course Name</Typography>
                <TextField fullWidth value={course.name} onChange={(e) => setCourse({ ...course, name: e.target.value })} />
              </Box>
            </Box>

            {/* Department */}
            <Box mt={2}>
              <Typography fontWeight="bold">Department</Typography>
              <TextField
                select
                fullWidth
                value={course.department?._id || ''}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    department: {
                      ...course.department,
                      _id: e.target.value
                    }
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

            {/* Active */}
            <Box mt={2}>
              <Typography fontWeight="bold">Active</Typography>
              <TextField
                select
                fullWidth
                value={course.isActive}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    isActive: e.target.value == true
                  })
                }
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
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

export default EditCourseDialog;
