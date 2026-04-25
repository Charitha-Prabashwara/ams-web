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
  Alert,
  Backdrop,
  CircularProgress
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
  onSubjectSelected,
  subjectLoading = false,
  lecturerLoading = false,
  semesterError = null,
  subjectError = null,
  onReload
}) => {
  console.log('EditLectureDialog render — semesters count:', semesters.length);
  // State options for status
  const stateOptions = [
    { value: 'scheduled', label: 'scheduled' },
    { value: 'completed', label: 'completed' },
    { value: 'postponed', label: 'postponed' },
    { value: 'canceled', label: 'canceled' },
    { value: 'rescheduled', label: 'rescheduled' }
  ];

  // Helper to extract ID from object, array, or string
  const getId = (field) => {
    if (!field) return '';
    if (Array.isArray(field)) {
      const first = field[0];
      if (typeof first === 'object') return first._id || first.id || '';
      return first || '';
    }
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return field._id || field.id || '';
    return '';
  };

  // Auto-load subjects and lecturers when editing existing lecture
  const prevLectureIdRef = React.useRef(null);

  React.useEffect(() => {
    if (lecture && open && lecture.id && prevLectureIdRef.current !== lecture.id) {
      prevLectureIdRef.current = lecture.id;

      // Extract semester ID and trigger loading
      const semesterId = getId(lecture.semester);
      if (semesterId && onSemesterSelected) {
        onSemesterSelected(semesterId);
      }

      // Extract subject ID and trigger loading
      const subjectId = getId(lecture.subject);
      if (subjectId && onSubjectSelected) {
        onSubjectSelected(subjectId);
      }
    }
  }, [lecture, open, onSemesterSelected, onSubjectSelected]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'semester') {
      onSemesterSelected?.(value);
      setLecture({
        ...lecture,
        semester: value,
        subject: '',
        lecturer: ''
      });
    } else if (field === 'subject') {
      onSubjectSelected?.(value);
      setLecture({
        ...lecture,
        subject: value,
        lecturer: ''
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

  const isValid = lecture?.topic && lecture?.lecturer && lecture?.subject && lecture?.semester && lecture?.scheduledTime;

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Edit Lecture</DialogTitle>

      <DialogContent
        dividers
        sx={{
          filter: subjectLoading || lecturerLoading ? 'blur(3px)' : 'none',
          pointerEvents: subjectLoading || lecturerLoading ? 'none' : 'auto',
          transition: 'filter 0.2s ease'
        }}
      >
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
                  Semester <span style={{ color: 'red' }}>*</span>
                </Typography>
                <FormControl fullWidth>
                  <Select value={getId(lecture.semester) || ''} onChange={handleChange('semester')} displayEmpty>
                    <MenuItem value="" disabled>
                      Select Semester
                    </MenuItem>
                    {semesters.map((semester) => (
                      <MenuItem key={semester._id || semester.id} value={semester._id || semester.id}>
                        {semester?.name || semester?.id}
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
                  <Select value={getId(lecture.subject) || ''} onChange={handleChange('subject')} displayEmpty>
                    <MenuItem value="" disabled>
                      {subjectLoading ? 'Loading subjects...' : !lecture?.semester ? 'Select a semester first' : 'Select Subject'}
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject._id || subject.id} value={subject._id || subject.id}>
                        {subject.name?.long || subject.code || 'Unknown'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box flex="1">
                <Typography fontWeight="bold" mb={1}>
                  Lecturer <span style={{ color: 'red' }}>*</span>
                </Typography>
                <FormControl fullWidth disabled={!lecture?.subject || lecturerLoading}>
                  <Select value={getId(lecture.lecturer) || ''} onChange={handleChange('lecturer')} displayEmpty>
                    <MenuItem value="" disabled>
                      {lecturerLoading ? 'Loading lecturers...' : !lecture?.subject ? 'Select a subject first' : 'Select Lecturer'}
                    </MenuItem>
                    {lecturers.map((lecturer) => (
                      <MenuItem key={lecturer._id || lecturer.id} value={lecturer._id || lecturer.id}>
                        {lecturer.name?.full_name || lecturer.registration_id || 'Unknown'}
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
                <Select value={lecture.state || 'SCHEDULED'} onChange={handleChange('state')}>
                  {stateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Deleted Status Info */}
            {lecture.deleted && <Alert severity="warning">This lecture is marked as deleted.</Alert>}
          </Box>
        )}
      </DialogContent>

      {/* Reload section for failed data loads */}
      {(semesterError || subjectError) && onReload && (
        <Box sx={{ px: 3, py: 2, bgcolor: 'error.light', borderTop: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error.contrastText" variant="body2" mb={1}>
            Failed to load data due to connection issue. Please try again.
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
            Reload Data
          </Button>
        </Box>
      )}

      <DialogActions>
        <Button color="error" onClick={onDelete} disabled={subjectLoading || lecturerLoading}>
          Delete
        </Button>
        <Button variant="contained" onClick={onSave} disabled={!isValid || subjectLoading || lecturerLoading}>
          Save Changes
        </Button>
        <Button onClick={onClose} disabled={subjectLoading || lecturerLoading}>
          Close
        </Button>
      </DialogActions>

      {/* ================= LOADER OVERLAY ================= */}
      <Backdrop
        open={subjectLoading || lecturerLoading}
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

export default EditLectureDialog;
