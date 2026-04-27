// material-ui
import { Chip, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import MainCard from 'components/MainCard';
import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import { showToast } from '../../utils/toast';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import DetailsViewBox from '../../components/DetailsViewBox';

// Helper to decode JWT token
const getCurrentLecturerId = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || payload.userId || payload.sub || payload.lecturerId || payload.lecturer_id;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
};

export default function LecturerLectureScheduling() {
  const currentLecturerId = getCurrentLecturerId();

  // ---------- FETCH LECTURERS ----------
  const { data: lecturersData, error: lecturersError } = useSWR(['/admin/find/', { type: 'lecturer' }], fetcher);
  const lecturers = lecturersData?.data?.users || [];

  // Current lecturer details
  const currentLecturer = useMemo(() => {
    if (!currentLecturerId) return null;
    return lecturers.find(l => l.id === currentLecturerId || l._id === currentLecturerId) || null;
  }, [lecturers, currentLecturerId]);

  // ---------- FETCH SUBJECTS ----------
  const { data: subjectsData, error: subjectsError } = useSWR('/subject/find/', fetcher);
  const subjects = subjectsData?.subjects || [];

  // ---------- FETCH SEMESTERS ----------
  const { data: semestersData, error: semestersError } = useSWR('/semester/find/', fetcher);
  const semesters = semestersData?.semesters || [];

  // ---------- FETCH LECTURES (ALL then filter) ----------
  const { data: lecturesData, error: lecturesError, mutate } = useSWR('/lecture/find/', fetcher, { refreshInterval: 10000 });
  const allLectures = lecturesData?.lecture || lecturesData?.lectures || lecturesData?.data?.lecture || lecturesData?.data?.lectures || [];
  const lectures = currentLecturerId ? allLectures.filter(l => {
    const lId = typeof l.lecturer === 'string' ? l.lecturer : (l.lecturer?._id || l.lecturer?.id);
    return lId === currentLecturerId;
  }) : [];

  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginated = lectures.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(lectures.length / rowsPerPage);

  // ---------- CREATE ----------
  const [openCreate, setOpenCreate] = useState(false);
  const [newLecture, setNewLecture] = useState({
    topic: '',
    lecturer: currentLecturerId || '',
    subject: '',
    semester: '',
    scheduledTime: ''
  });
  const [createSemesterSubjects, setCreateSemesterSubjects] = useState([]);
  const [createLoadingSubjects, setCreateLoadingSubjects] = useState(false);
  const [createSubjectsError, setCreateSubjectsError] = useState(null);

  // ---------- EDIT ----------
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [editLecture, setEditLecture] = useState(null);
  const [editSemesterSubjects, setEditSemesterSubjects] = useState([]);
  const [editLoadingSubjects, setEditLoadingSubjects] = useState(false);
  const [editSubjectsError, setEditSubjectsError] = useState(null);

  // ---------- DELETE ----------
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  // ---------- HELPERS ----------
  const fetchSubjectsForSemester = async (semesterId, isEditMode = true) => {
    if (!semesterId) {
      if (isEditMode) {
        setEditSemesterSubjects([]);
        setEditLoadingSubjects(false);
      } else {
        setCreateSemesterSubjects([]);
        setCreateLoadingSubjects(false);
      }
      return;
    }
    try {
      if (isEditMode) {
        setEditLoadingSubjects(true);
        setEditSubjectsError(null);
      } else {
        setCreateLoadingSubjects(true);
        setCreateSubjectsError(null);
      }
      const response = await axiosClient.post('/subject-registration/find/', { semester: semesterId });
      const registrations = response.data.registrations || [];
      const subjectMap = new Map();
      registrations.forEach(reg => {
        const subject = reg.subject;
        if (subject && typeof subject === 'object' && subject._id) {
          if (!subjectMap.has(subject._id)) {
            subjectMap.set(subject._id, subject);
          }
        } else if (subject && typeof subject === 'string') {
          const fullSubject = subjects.find(s => s.id === subject || s._id === subject);
          if (fullSubject && !subjectMap.has(fullSubject.id)) {
            subjectMap.set(fullSubject.id, fullSubject);
          }
        }
      });
      const results = Array.from(subjectMap.values());
      if (isEditMode) {
        setEditSemesterSubjects(results);
      } else {
        setCreateSemesterSubjects(results);
      }
    } catch (err) {
      console.error('Failed to fetch subjects for semester:', err);
      if (isEditMode) {
        setEditSubjectsError(err);
      } else {
        setCreateSubjectsError(err);
      }
      showToast({ text: 'Failed to load subjects for selected semester', type: 'error' });
    } finally {
      if (isEditMode) {
        setEditLoadingSubjects(false);
      } else {
        setCreateLoadingSubjects(false);
      }
    }
  };

  // Initialize edit form when selected lecture changes
  useEffect(() => {
    if (selectedLecture) {
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
      const semesterId = getId(selectedLecture.semester);
      // Load subjects for this semester
      fetchSubjectsForSemester(semesterId, true);
      setEditLecture({
        ...selectedLecture,
        semester: semesterId,
        subject: getId(selectedLecture.subject),
        lecturer: currentLecturerId,
        state: selectedLecture.state || 'SCHEDULED',
        scheduledTimeDisplay: selectedLecture.scheduledTime ? new Date(selectedLecture.scheduledTime).toISOString().slice(0, 16) : '',
        endTimeDisplay: selectedLecture.endTime ? new Date(selectedLecture.endTime).toISOString().slice(0, 16) : '',
        actualStartTimeDisplay: selectedLecture.actualStartTime ? new Date(selectedLecture.actualStartTime).toISOString().slice(0, 16) : ''
      });
    }
  }, [selectedLecture, currentLecturerId]);

  // ---------- HANDLERS ----------
  const handleCreate = async () => {
    try {
      const payload = {
        topic: newLecture.topic,
        lecturer: currentLecturerId,
        subject: newLecture.subject,
        semester: newLecture.semester,
        scheduledTime: newLecture.scheduledTime
      };
      await axiosClient.post('/lecture/', payload);
      showToast({ text: 'Lecture scheduled successfully', type: 'success' });
      mutate();
      setOpenCreate(false);
      setNewLecture({
        topic: '',
        lecturer: currentLecturerId,
        subject: '',
        semester: '',
        scheduledTime: ''
      });
      setCreateSemesterSubjects([]);
    } catch (err) {
      console.error('Create lecture error:', err);
      showToast({
        text: err.response?.data?.message || 'Failed to schedule lecture',
        type: 'error'
      });
    }
  };

  const handleUpdate = async () => {
    if (!editLecture?.id) return;
    try {
      const allowedFields = ['topic', 'lecturer', 'subject', 'semester', 'scheduledTime', 'endTime', 'actualStartTime', 'state'];
      const updateData = {};
      allowedFields.forEach((field) => {
        const value = editLecture[field];
        if (value !== undefined && value !== null && value !== '') {
          updateData[field] = value;
        }
      });
      await axiosClient.put('/lecture/id/', { id: editLecture.id, ...updateData });
      showToast({ text: 'Lecture updated successfully', type: 'success' });
      mutate();
      setOpenEdit(false);
      setSelectedLecture(null);
    } catch (err) {
      console.error('Update lecture error:', err);
      showToast({
        text: err.response?.data?.message || 'Failed to update lecture',
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedLecture?.id) return;
    try {
      await axiosClient.delete('/lecture/id/', { data: { id: selectedLecture.id } });
      showToast({ text: 'Lecture deleted successfully', type: 'success' });
      mutate();
      setOpenConfirmDelete(false);
      setOpenEdit(false);
      setSelectedLecture(null);
    } catch (err) {
      console.error('Delete lecture error:', err);
      showToast({
        text: err.response?.data?.message || 'Failed to delete lecture',
        type: 'error'
      });
    }
  };

  // When semester selected in create dialog
  const handleCreateSemesterChange = (semId) => {
    setNewLecture(prev => ({ ...prev, semester: semId, subject: '' }));
    fetchSubjectsForSemester(semId, false);
  };

  // When semester selected in edit dialog
  const handleEditSemesterChange = (semId) => {
    setEditLecture(prev => ({ ...prev, semester: semId, subject: '' }));
    fetchSubjectsForSemester(semId, true);
  };

  // ---------- RENDER HELPERS ----------
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'SCHEDULED': return 'primary';
      case 'IN_PROGRESS': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getSubjectName = (subjectRef) => {
    if (!subjectRef) return 'Unknown';
    if (Array.isArray(subjectRef)) subjectRef = subjectRef[0];
    const subjectId = typeof subjectRef === 'string' ? subjectRef : subjectRef?._id || subjectRef?.id;
    const found = subjects.find(s => String(s.id) === String(subjectId) || String(s._id) === String(subjectId));
    return found?.name?.long || found?.code || 'Unknown';
  };

  const getSemesterName = (semesterRef) => {
    if (!semesterRef) return 'Unknown';
    if (Array.isArray(semesterRef)) semesterRef = semesterRef[0];
    const semesterId = typeof semesterRef === 'string' ? semesterRef : semesterRef?._id || semesterRef?.id;
    const found = semesters.find(s => String(s.id) === String(semesterId) || String(s._id) === String(semesterId));
    return found?.name || found?.id || 'Unknown';
  };

  const getLecturerName = () => {
    return currentLecturer?.name?.full_name || currentLecturer?.registration_id || 'You';
  };

  // Loading and error states
  if (lecturersError || subjectsError || semestersError || lecturesError) {
    return <LoadingErrorWrapper isLoading={false} isError />;
  }
  if (!lecturersData || !subjectsData || !semestersData || !lecturesData) {
    return <LoadingErrorWrapper isLoading isError={false} />;
  }

  return (
    <MainCard title="My Lecture Scheduling">
      <UniversalActionBar
        buttons={[
          { label: 'Schedule New Lecture', color: 'success', onClick: () => setOpenCreate(true) }
        ]}
      />

      <UniversalTable
        data={paginated}
        page={page}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onPageChange={setPage}
        columns={[
          {
            label: 'Topic',
            render: (r) => (
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {r.topic?.substring(0, 50)}
                  {r.topic?.length > 50 ? '...' : ''}
                </Typography>
              </Box>
            )
          },
          {
            label: 'Subject',
            render: (r) => getSubjectName(r.subject)
          },
          {
            label: 'Semester',
            render: (r) => getSemesterName(r.semester)
          },
          {
            label: 'Scheduled',
            render: (r) => formatDate(r.scheduledTime)
          },
          {
            label: 'Actual Start',
            render: (r) => formatDate(r.actualStartTime)
          },
          {
            label: 'End',
            render: (r) => formatDate(r.endTime)
          },
          {
            label: 'Status',
            render: (r) => <Chip label={r.state || 'SCHEDULED'} color={getStatusColor(r.state)} size="small" variant="outlined" />
          }
        ]}
        renderActions={(lecture) => (
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLecture(lecture);
              setOpenEdit(true);
            }}
          >
            Manage
          </Button>
        )}
      />

      {/* CREATE LECTURE DIALOG */}
      <Dialog open={openCreate} onClose={() => { setOpenCreate(false); setCreateSemesterSubjects([]); }} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Lecture</DialogTitle>
        <DialogContent>
          <Box mt={2} display="grid" gap={2}>
            <TextField
              label="Topic"
              value={newLecture.topic}
              onChange={(e) => setNewLecture(prev => ({ ...prev, topic: e.target.value }))}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Semester</InputLabel>
              <Select
                value={newLecture.semester}
                label="Semester"
                onChange={(e) => handleCreateSemesterChange(e.target.value)}
              >
                {semesters.map((sem) => (
                  <MenuItem key={sem.id || sem._id} value={sem.id || sem._id}>
                    {sem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Subject</InputLabel>
              <Select
                value={newLecture.subject}
                label="Subject"
                onChange={(e) => setNewLecture(prev => ({ ...prev, subject: e.target.value }))}
                disabled={!newLecture.semester || createLoadingSubjects}
              >
                {createLoadingSubjects ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : createSemesterSubjects.length === 0 ? (
                  <MenuItem disabled>No subjects for this semester</MenuItem>
                ) : (
                  createSemesterSubjects.map((sub) => (
                    <MenuItem key={sub.id || sub._id} value={sub.id || sub._id}>
                      {sub.code} | {sub.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {createSubjectsError && <Typography color="error" variant="caption">Failed to load subjects</Typography>}
            </FormControl>
            <TextField
              label="Scheduled Time"
              type="datetime-local"
              value={newLecture.scheduledTime}
              onChange={(e) => setNewLecture(prev => ({ ...prev, scheduledTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            {/* Lecturer is fixed and not shown */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleCreate}>Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT LECTURE DIALOG */}
      <Dialog open={openEdit} onClose={() => { setOpenEdit(false); setSelectedLecture(null); setEditSemesterSubjects([]); }} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Lecture</DialogTitle>
        <DialogContent>
          <Box mt={2} display="grid" gap={2}>
            <TextField
              label="Topic"
              value={editLecture?.topic || ''}
              onChange={(e) => setEditLecture(prev => ({ ...prev, topic: e.target.value }))}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Semester</InputLabel>
              <Select
                value={editLecture?.semester || ''}
                label="Semester"
                onChange={(e) => handleEditSemesterChange(e.target.value)}
              >
                {semesters.map((sem) => (
                  <MenuItem key={sem.id || sem._id} value={sem.id || sem._id}>
                    {sem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Subject</InputLabel>
              <Select
                value={editLecture?.subject || ''}
                label="Subject"
                onChange={(e) => setEditLecture(prev => ({ ...prev, subject: e.target.value }))}
                disabled={editLoadingSubjects}
              >
                {editLoadingSubjects ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : editSemesterSubjects.length === 0 ? (
                  <MenuItem disabled>No subjects for this semester</MenuItem>
                ) : (
                  editSemesterSubjects.map((sub) => (
                    <MenuItem key={sub.id || sub._id} value={sub.id || sub._id}>
                      {sub.code} | {sub.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {editSubjectsError && <Typography color="error" variant="caption">Failed to load subjects</Typography>}
            </FormControl>
            <TextField
              label="Scheduled Time"
              type="datetime-local"
              value={editLecture?.scheduledTimeDisplay || ''}
              onChange={(e) => setEditLecture(prev => ({ ...prev, scheduledTime: e.target.value, scheduledTimeDisplay: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={editLecture?.endTimeDisplay || ''}
              onChange={(e) => setEditLecture(prev => ({ ...prev, endTime: e.target.value, endTimeDisplay: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Actual Start Time"
              type="datetime-local"
              value={editLecture?.actualStartTimeDisplay || ''}
              onChange={(e) => setEditLecture(prev => ({ ...prev, actualStartTime: e.target.value, actualStartTimeDisplay: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editLecture?.state || 'SCHEDULED'}
                label="Status"
                onChange={(e) => setEditLecture(prev => ({ ...prev, state: e.target.value }))}
              >
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(true)} color="error">Delete</Button>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        confirmText={selectedLecture?.topic || ''}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete Lecture"
        message="Are you sure you want to delete this lecture? This action cannot be undone."
      />

      {selectedLecture && (
        <DetailsViewBox
          title="Lecture Details"
          data={{
            Topic: selectedLecture.topic,
            Lecturer: getLecturerName(),
            Subject: getSubjectName(selectedLecture.subject),
            Semester: getSemesterName(selectedLecture.semester),
            'Scheduled Time': formatDate(selectedLecture.scheduledTime),
            'Actual Start': formatDate(selectedLecture.actualStartTime),
            'End Time': formatDate(selectedLecture.endTime),
            Status: selectedLecture.state || 'SCHEDULED'
          }}
          createdAt={selectedLecture.createdAt_timestamp}
          updatedAt={selectedLecture.updatedAt_timestamp}
        />
      )}
    </MainCard>
  );
}
