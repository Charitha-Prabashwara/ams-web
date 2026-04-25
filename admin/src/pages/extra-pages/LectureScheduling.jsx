// material-ui
import { Chip, Box, Typography, Button } from '@mui/material';

import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import { showToast } from '../../utils/toast';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import CreateLectureDialog from '../../components/CreateLectureDialog';
import EditLectureDialog from '../../components/EditLectureDialog';
import lectureAPI from '../../api/lecture';
import axiosClient from '../../api/axiosClient';

export default function LectureScheduling() {
  // ---------- FETCH LECTURERS ----------
  const { data: lecturersData, error: lecturersError } = useSWR(['/admin/find/', { type: 'lecturer' }], fetcher);
  const lecturers = lecturersData?.data?.users || [];

  // ---------- FETCH SUBJECTS ----------
  const { data: subjectsData, error: subjectsError } = useSWR('/subject/find/', fetcher);
  const subjects = subjectsData?.subjects || [];

  // ---------- FETCH SEMESTERS ----------
  const { data: semestersResponse, error: semestersError } = useSWR('/semester/find/', fetcher);
  semestersResponse?.semester || semestersResponse?.data?.semesters || semestersResponse?.data?.semester || [];
  //console.log(semestersResponse);
  const semesters = semestersResponse?.semesters || [];
  console.log(semesters);

  //console.log('Semesters loaded:', semesters.length, 'Response keys:', semestersResponse ? Object.keys(semestersResponse) : []);

  // ---------- FETCH LECTURES ----------
  const { data: lecturesData, error: lecturesError, mutate } = useSWR('/lecture/find/', fetcher, { refreshInterval: 10000 });
  const lectures = lecturesData?.lecture || lecturesData?.lectures || lecturesData?.data?.lecture || lecturesData?.data?.lectures || [];

  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginated = lectures.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(lectures.length / rowsPerPage);

  // ---------- CREATE ----------
  const [openCreate, setOpenCreate] = useState(false);
  const [newLecture, setNewLecture] = useState({
    topic: '',
    lecturer: '',
    subject: '',
    semester: '',
    scheduledTime: ''
  });

  // ---------- EDIT ----------
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [editLecture, setEditLecture] = useState(null);
  const [semesterSubjects, setSemesterSubjects] = useState([]);
  const [loadingSemesterSubjects, setLoadingSemesterSubjects] = useState(false);
  const [subjectLecturers, setSubjectLecturers] = useState([]);
  const [loadingSubjectLecturers, setLoadingSubjectLecturers] = useState(false);

  // ---------- DELETE ----------
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  // Watch semesters changes
  useEffect(() => {
    console.log('Semesters updated:', semesters.length, semesters);
  }, [semesters]);

  // Initialize edit form when selected lecture changes
  useEffect(() => {
    if (selectedLecture) {
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
      
      setEditLecture({
        ...selectedLecture,
        semester: getId(selectedLecture.semester),
        subject: getId(selectedLecture.subject),
        lecturer: getId(selectedLecture.lecturer),
        state: selectedLecture.state || 'SCHEDULED',
        scheduledTimeDisplay: selectedLecture.scheduledTime ? new Date(selectedLecture.scheduledTime).toISOString().slice(0, 16) : '',
        endTimeDisplay: selectedLecture.endTime ? new Date(selectedLecture.endTime).toISOString().slice(0, 16) : ''
      });
    }
  }, [selectedLecture]);

  // ---------- HANDLERS ----------
  const handleCreate = async () => {
    try {
      await lectureAPI.create(newLecture);
      showToast({ text: 'Lecture scheduled successfully', type: 'success' });
      mutate();
      setOpenCreate(false);
      setNewLecture({
        topic: '',
        lecturer: '',
        subject: '',
        semester: '',
        scheduledTime: ''
      });
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
      const allowedFields = ['topic', 'lecturer', 'subject', 'semester', 'scheduledTime', 'endTime', 'state', 'deleted'];
      const updateData = {};
      allowedFields.forEach((field) => {
        const value = editLecture[field];
        if (value !== undefined && value !== null && value !== '') {
          updateData[field] = value;
        }
      });

      await lectureAPI.update(editLecture.id, updateData);
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
      await lectureAPI.delete(selectedLecture.id);
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

  const handleSemesterSelected = async (semesterId) => {
    setLoadingSemesterSubjects(true);
    setSemesterSubjects([]);

    if (!semesterId) {
      setLoadingSemesterSubjects(false);
      return;
    }

    try {
      const response = await axiosClient.post('/subject-registration/find/', { semester: semesterId });
      const registrations = response.data.registrations || [];
      const subjectMap = new Map();

      registrations.forEach((reg) => {
        const subject = reg.subject;
        if (subject && typeof subject === 'object' && subject._id) {
          if (!subjectMap.has(subject._id)) {
            subjectMap.set(subject._id, subject);
          }
        } else if (subject && typeof subject === 'string') {
          const fullSubject = subjects.find((s) => s.id === subject || s._id === subject);
          if (fullSubject && !subjectMap.has(fullSubject.id)) {
            subjectMap.set(fullSubject.id, fullSubject);
          }
        }
      });

      setSemesterSubjects(Array.from(subjectMap.values()));
    } catch (err) {
      console.error('Failed to fetch subjects for semester:', err);
      showToast({ text: 'Failed to load subjects for selected semester', type: 'error' });
    } finally {
      setLoadingSemesterSubjects(false);
    }
  };

  const handleSubjectSelected = async (subjectId) => {
    setLoadingSubjectLecturers(true);
    setSubjectLecturers([]);

    if (!subjectId) {
      setLoadingSubjectLecturers(false);
      return;
    }

    try {
      const response = await axiosClient.post('/lecturer-subject-registration/find/', { subject: subjectId });
      const registrations = response.data.registrations || [];
      const lecturerMap = new Map();

      registrations.forEach((reg) => {
        const lecturer = reg.lecturer;
        if (lecturer && typeof lecturer === 'object' && lecturer._id) {
          if (!lecturerMap.has(lecturer._id)) {
            lecturerMap.set(lecturer._id, lecturer);
          }
        } else if (lecturer && typeof lecturer === 'string') {
          const fullLecturer = lecturers.find((l) => l.id === lecturer || l._id === lecturer);
          if (fullLecturer && !lecturerMap.has(fullLecturer.id)) {
            lecturerMap.set(fullLecturer.id, fullLecturer);
          }
        }
      });

      setSubjectLecturers(Array.from(lecturerMap.values()));
    } catch (err) {
      console.error('Failed to fetch lecturers for subject:', err);
      showToast({ text: 'Failed to load lecturers for selected subject', type: 'error' });
    } finally {
      setLoadingSubjectLecturers(false);
    }
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
      case 'SCHEDULED':
        return 'primary';
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getLecturerName = (lecturerRef) => {
    if (!lecturerRef) return 'Unknown';
    if (Array.isArray(lecturerRef)) {
      lecturerRef = lecturerRef[0];
    }
    const lecturerId = typeof lecturerRef === 'string' ? lecturerRef : lecturerRef?._id ? String(lecturerRef._id) : lecturerRef?.id;
    if (!lecturerId) return 'Unknown';
    const found = lecturers.find((l) => String(l.id) === String(lecturerId) || String(l._id) === String(lecturerId));
    return found?.name?.full_name || found?.registration_id || 'Unknown';
  };

  const getSubjectName = (subjectRef) => {
    if (!subjectRef) return 'Unknown';
    if (Array.isArray(subjectRef)) {
      subjectRef = subjectRef[0];
    }
    const subjectId = typeof subjectRef === 'string' ? subjectRef : subjectRef?._id ? String(subjectRef._id) : subjectRef?.id;
    if (!subjectId) return 'Unknown';
    const found = subjects.find((s) => String(s.id) === String(subjectId) || String(s._id) === String(subjectId));
    return found?.name?.long || found?.code || 'Unknown';
  };

  const getSemesterName = (semesterRef) => {
    if (!semesterRef) return 'Unknown';
    if (Array.isArray(semesterRef)) {
      semesterRef = semesterRef[0];
    }
    const semesterId = typeof semesterRef === 'string' ? semesterRef : semesterRef?._id ? String(semesterRef._id) : semesterRef?.id;
    if (!semesterId) return 'Unknown';
    const found = semesters.find((s) => String(s.id) === String(semesterId) || String(s._id) === String(semesterId));
    if (!found) {
      console.warn(
        'Semester not found for ID:',
        semesterId,
        'Semesters available IDs:',
        semesters.map((s) => s.id)
      );
    }
    return found?.name || found?.id;
  };

  // Loading and error states
  if (lecturersError || subjectsError || semestersError || lecturesError) {
    console.error('Fetch errors:', { lecturersError, subjectsError, semestersError, lecturesError });
    return <LoadingErrorWrapper isLoading={false} isError />;
  }

  if (!lecturersData || !subjectsData || !semestersResponse || !lecturesData) return <LoadingErrorWrapper isLoading isError={false} />;

  // Debug: log essential info
  console.log('Semesters loaded count:', semesters.length);
  if (semesters.length === 0) {
    console.warn('Semesters array empty. Raw response:', semestersResponse);
  }

  return (
    <MainCard title="Lecture Scheduling">
      {/* Action Bar */}
      <UniversalActionBar
        buttons={[
          {
            label: 'Schedule New Lecture',
            color: 'success',
            onClick: () => setOpenCreate(true)
          }
        ]}
      />

      {/* Lectures Table */}
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
            label: 'Lecturer',
            render: (r) => getLecturerName(r.lecturer)
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

      {/* Create Dialog */}
      <CreateLectureDialog
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setSemesterSubjects([]);
          setSubjectLecturers([]);
          setNewLecture({
            topic: '',
            lecturer: '',
            subject: '',
            semester: '',
            scheduledTime: ''
          });
        }}
        onSave={handleCreate}
        lecture={newLecture}
        setLecture={setNewLecture}
        lecturers={newLecture.subject ? subjectLecturers : []}
        subjects={semesterSubjects}
        semesters={semesters}
        onSemesterSelected={handleSemesterSelected}
        onSubjectSelected={handleSubjectSelected}
        subjectLoading={loadingSemesterSubjects}
        lecturerLoading={loadingSubjectLecturers}
      />

      {/* Edit Dialog */}
      <EditLectureDialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedLecture(null);
          setSemesterSubjects([]);
          setSubjectLecturers([]);
        }}
        onSave={handleUpdate}
        onDelete={() => setOpenConfirmDelete(true)}
        lecture={editLecture}
        setLecture={setEditLecture}
        lecturers={editLecture?.subject ? subjectLecturers : []}
        subjects={editLecture?.semester ? semesterSubjects : subjects}
        semesters={semesters}
        onSemesterSelected={handleSemesterSelected}
        onSubjectSelected={handleSubjectSelected}
        subjectLoading={loadingSemesterSubjects}
        lecturerLoading={loadingSubjectLecturers}
      />

      {/* Delete Confirmation */}
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
    </MainCard>
  );
}
