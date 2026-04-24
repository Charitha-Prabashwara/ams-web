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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';

const EditLectureDialog = ({
  open,
  onClose,
  onSave,
  onDelete,
  lecture,
  setLecture,
  lecturers = [],
  subjects = [],
  semesters = [],
  onSemesterSelected,
  subjectLoading = false
}) => {
  console.log('EditLectureDialog render — semesters count:', semesters.length);
  // State options for status
  const stateOptions = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  // Populate form when lecture changes
  React.useEffect(() => {
    if (lecture && open) {
      setLecture({
        ...lecture,
        scheduledTimeDisplay: lecture.scheduledTime
          ? new Date(lecture.scheduledTime).toISOString().slice(0, 16)
          : '',
        endTimeDisplay: lecture.endTime
          ? new Date(lecture.endTime).toISOString().slice(0, 16)
          : ''
      });
    }
  }, [lecture, open, setLecture]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'semester') {
      onSemesterSelected?.(value);
      setLecture({
        ...lecture,
        semester: value,
        subject: ''
      });
    } else {
      setLecture({
        ...lecture,
        [field]: value
      });
    }
  };

  const handleDateChange = (field) => (e) => {
    const localDateTime = e.target.value;
    if (localDateTime) {
      const date = new Date(localDateTime);
      const isoString = date.toISOString();
      setLecture({
        ...lecture,
        [field]: isoString,
        [`${field}Display`]: localDateTime
      });
    } else {
      setLecture({
        ...lecture,
        [field]: '',
        [`${field}Display`]: ''
      });
    }
  };

  const isValid =
    lecture?.topic &&
    lecture?.lecturer &&
    lecture?.subject &&
    lecture?.semester &&
    lecture?.scheduledTime;

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Edit Lecture</DialogTitle>

      <DialogContent dividers>
        {lecture && (
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            {/* Topic */}
            <Box>
              <Typography fontWeight="bold" mb={1}>
                Topic <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter lecture topic"
                value={lecture.topic || ''}
                onChange={handleChange('topic')}
                multiline
                rows={2}
              />
            </Box>

            {/* Lecturer, Subject, Semester */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              <Box flex="1">
                <Typography fontWeight="bold" mb={1}>
                  Lecturer <span style={{ color: 'red' }}>*</span>
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={lecture.lecturer || ''}
                    onChange={handleChange('lecturer')}
                  >
                    {lecturers.map((lecturer) => (
                      <MenuItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.name?.full_name || lecturer.registration_id || 'Unknown'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box flex="1">
                <Typography fontWeight="bold" mb={1}>
                  Subject <span style={{ color: 'red' }}>*</span>
                </Typography>
                <FormControl fullWidth disabled={!lecture?.semester || subjectLoading}>
                  <Select
                    value={lecture.subject || ''}
                    onChange={handleChange('subject')}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      {subjectLoading ? 'Loading subjects...' : !lecture?.semester ? 'Select a semester first' : 'Select Subject'}
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id || subject._id} value={subject.id || subject._id}>
                        {subject.name?.long || subject.code || 'Unknown'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box flex="1">
                <Typography fontWeight="bold" mb={1}>
                  Semester <span style={{ color: 'red' }}>*</span>
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={lecture.semester || ''}
                    onChange={handleChange('semester')}
                  >
                  {semesters.map((semester) => (
                    <MenuItem key={semester.id || semester._id} value={semester.id || semester._id}>
                      {semester.name?.medium || semester.name?.long || 'Semester'}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Scheduled Time and End Time */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              <Box flex="1">
                <Typography fontWeight="bold" mb={1}>
                  Scheduled Time <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="datetime-local"
                  value={lecture.scheduledTimeDisplay || ''}
                  onChange={handleDateChange('scheduledTime')}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Box>

              <Box flex="1">
                <Typography fontWeight="bold" mb={1}>
                  End Time (optional)
                </Typography>
                <TextField
                  fullWidth
                  type="datetime-local"
                  value={lecture.endTimeDisplay || ''}
                  onChange={handleDateChange('endTime')}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Box>
            </Box>

            {/* State */}
            <Box>
              <Typography fontWeight="bold" mb={1}>
                Status
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={lecture.state || 'SCHEDULED'}
                  onChange={handleChange('state')}
                >
                  {stateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Deleted Status Info */}
            {lecture.deleted && (
              <Alert severity="warning">
                This lecture is marked as deleted.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="contained" onClick={onSave} disabled={!isValid}>
          Save Changes
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLectureDialog;
