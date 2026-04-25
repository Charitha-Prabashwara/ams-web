import React from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import { showToast } from '../utils/toast';

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

const CreateLectureDialog = ({
  open,
  onClose,
  onSave,
  lecture,
  setLecture,
  lecturers = [],
  subjects = [],
  semesters = [],
  onSemesterSelected,
  onSubjectSelected,
  subjectLoading = false,
  lecturerLoading = false
}) => {
  console.log('CreateLectureDialog render — semesters count:', semesters.length);
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
    console.log('Field changed:', field, 'new value:', value);
  };

  const handleDateChange = (field) => (e) => {
    // Convert datetime-local to ISO string with timezone offset
    const localDateTime = e.target.value;
    if (localDateTime) {
      const date = new Date(localDateTime);
      const isoString = date.toISOString();
      setLecture({
        ...lecture,
        [field]: isoString
      });
    } else {
      setLecture({
        ...lecture,
        [field]: ''
      });
    }
  };

  // Validation check
  const isValid = lecture.topic && lecture.lecturer && lecture.subject && lecture.semester && lecture.scheduledTime;

  // const loadsubjects=(semesterId)=>{
  //   // ---------- FETCH LECTURERS ----------
  //   const { data: subjectRegistration, error: lecturersError } = useSWR(
  //     ['/subject-registration/find/', { semester: semesterId }],
  //     fetcher
  //   );
  //   const lecturers = subjectRegistration?.data?.users || [];
  // }

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Schedule New Lecture</DialogTitle>

      <DialogContent
        dividers
        sx={{
          filter: subjectLoading || lecturerLoading ? 'blur(3px)' : 'none',
          pointerEvents: subjectLoading || lecturerLoading ? 'none' : 'auto',
          transition: 'filter 0.2s ease'
        }}
      >
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
                <Select value={lecture.semester || ''} onChange={handleChange('semester')} displayEmpty>
                  <MenuItem value="" disabled>
                    Select Semester
                  </MenuItem>
                  {semesters.map((semester) => (
                    <MenuItem key={semester.id || semester._id} value={semester.id || semester._id}>
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
              <FormControl fullWidth disabled={!lecture.semester || subjectLoading}>
                <Select value={lecture.subject || ''} onChange={handleChange('subject')} displayEmpty>
                  <MenuItem value="" disabled>
                    {subjectLoading ? 'Loading subjects...' : !lecture.semester ? 'Select a semester first' : 'Select Subject'}
                  </MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id || subject._id} value={subject.id || subject._id}>
                      {subject.code} - {subject?.name || ''}
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
                <Select value={lecture.lecturer || ''} onChange={handleChange('lecturer')} displayEmpty>
                  <MenuItem value="" disabled>
                    {lecturerLoading ? 'Loading lecturers...' : !lecture?.subject ? 'Select a subject first' : 'Select Lecturer'}
                  </MenuItem>
                  {lecturers.map((lecturer) => (
                    <MenuItem key={lecturer.id || lecturer._id} value={lecturer.id || lecturer._id}>
                      {lecturer.name?.full_name || lecturer.registration_id || 'Unknown'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Scheduled Time */}
          <Box>
            <Typography fontWeight="bold" mb={1}>
              Scheduled Time <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={lecture.scheduledTime ? new Date(lecture.scheduledTime).toISOString().slice(0, 16) : ''}
              onChange={handleDateChange('scheduledTime')}
              InputLabelProps={{
                shrink: true
              }}
              helperText="Local date and time"
            />
          </Box>

          {/* Info Alert */}
          {!lecture.scheduledTime && (
            <Alert severity="info">
              <Typography variant="body2">
                Please set a scheduled time for the lecture. Date-time will be saved in ISO 8601 format.
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={subjectLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} disabled={!isValid || subjectLoading}>
          Schedule Lecture
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

export default CreateLectureDialog;
