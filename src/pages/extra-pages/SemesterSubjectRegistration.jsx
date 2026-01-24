// SubjectRegistrationPage.jsx
import {
  Button
} from '@mui/material';

import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import ConfirmCreateDialog from '../../components/ConfirmCreateDialog';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import DetailsViewBox from '../../components/DetailsViewBox';
import LogBox from '../../components/LogBox';
import HelpDrawer from '../../components/HelpDrawer';
import { courseHelp } from '../../utils/helpDrawerContents';
import { showToast } from '../../utils/toast';
import CreateSubjectRegistration from '../../components/CreateSubjectRegistration';
import EditSubjectRegistration from '../../components/EditSubjectRegistration';

export default function SubjectRegistrationPage() {

  // ---------- SWR DATA ----------
  const { data: studentsData, error: studentsError, isLoading: studentsLoading, mutate: mutateStudents } =
    useSWR(['/admin/find/', { type: 'student' }], fetcher, {refreshInterval: 1000});

  const { data: subjectsData, error: subjectsError, isLoading: subjectsLoading, mutate: mutateSubjects } =
    useSWR(['/subject/find/',{}], fetcher);

  const { data: semestersData, error: semestersError, isLoading: semestersLoading, mutate: mutateSemesters } =
    useSWR(['/semester/find/',{}], fetcher);

  const { data: registrationsData, error: regError, isLoading: regLoading, mutate: mutateRegistrations } =
    useSWR(['/subject-registration/find/',{}], fetcher, { refreshInterval: 1000 });

  const students = studentsData?.data?.users || [];
  const subjects = subjectsData?.subjects || [];
  const semesters = semestersData?.semesters || [];
  const registrations = registrationsData?.registrations || [];

  // ---------- CREATE ----------
  const [openCreate, setOpenCreate] = useState(false);
  const [newRegistration, setNewRegistration] = useState({
    student: '',
    subject: '',
    semester: ''
  });
  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleFinalCreate = async () => {
    try {
      await axiosClient.post('/subject-registration/', newRegistration);
      mutateRegistrations();
      setOpenCreate(false);
      setOpenConfirmCreate(false);
      setNewRegistration({ student: '', subject: '', semester: '' });
      setConfirmText('');
      showToast({ text: 'Subject registered successfully!', type: 'success' });
    } catch (err) {
      showToast({ text: err.response?.data?.message || 'Registration failed', type: 'error' });
    }
  };

  // ---------- EDIT & DELETE ----------
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleSaveEdit = async () => {
    try {
      await axiosClient.put('/subject-registration/id/', selectedRegistration);
      mutateRegistrations();
      setOpenEdit(false);
      showToast({ text: 'Registration updated successfully!', type: 'success' });
    } catch (err) {
      showToast({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    }
  };

  const handleFinalDelete = async () => {
    try {
      await axiosClient.delete('/subject-registration/id/', {
        data: { id: selectedRegistration.id }
      });
      mutateRegistrations();
      setOpenEdit(false);
      setOpenConfirmDelete(false);
      showToast({ text: 'Registration deleted successfully!', type: 'success' });
    } catch (err) {
      showToast({ text: err.response?.data?.message || 'Delete failed', type: 'error' });
    }
  };

  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const paginatedRegs = registrations.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    mutateStudents();
    mutateSubjects();
    mutateSemesters();
    mutateRegistrations();
  }, []);

  if (studentsError || subjectsError || semestersError || regError)
    return <LoadingErrorWrapper isLoading={false} isError={true} />;

  if (studentsLoading || subjectsLoading || semestersLoading || regLoading)
    return <LoadingErrorWrapper isLoading={true} isError={false} />;

  return (
    <MainCard title="Student Subject Registrations">

      <UniversalActionBar
        buttons={[
          { label: 'New Registration', color: 'success', onClick: () => setOpenCreate(true) },
          { label: 'Open Help', type: 'help' }
        ]}
        helpDrawer={{ sections: courseHelp, title: 'Subject Registration Guidelines' }}
      />

      <UniversalTable
        data={paginatedRegs}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowClick={setSelectedRegistration}
        columns={[
          {
            label: 'Student',
            key: 'student',
            render: (row) => {
              const s = students.find(st => st.id === row.student._id);
              return s ? `${s.registration_id} | ${s.name?.full_name}` : '-';
            }
          },
          {
            label: 'Subject',
            key: 'subject',
            render: (row) => {
              const sub = subjects.find(s => s.id === row.subject._id);
              return sub ? `${sub.code} | ${sub.name}` : '-';
            }
          },
          {
            label: 'Semester',
            key: 'semester',
            render: (row) => {
              const sem = semesters.find(s => s.id === row.semester._id);
              return sem?.name || '-';
            }
          }
        ]}
        renderActions={(reg) => (
          <Button
            size="small"
            variant="contained"
            sx={{ backgroundColor: '#fbc02d', color: '#000' }}
            onClick={e => {
              e.stopPropagation();
              setSelectedRegistration(reg);
              setOpenEdit(true);
            }}
          >
            Manage
          </Button>
        )}
      />

      <CreateSubjectRegistration
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        students={students}
        subjects={subjects}
        semesters={semesters}
        registration={newRegistration}
        setRegistration={setNewRegistration}
        onRegisterClick={() => setOpenConfirmCreate(true)}
      />

      <ConfirmCreateDialog
        open={openConfirmCreate}
        onClose={() => setOpenConfirmCreate(false)}
        onConfirm={handleFinalCreate}
        confirmText={
          students.find(s => s.id === newRegistration.student)?.name?.full_name || ''
        }
        inputValue={confirmText}
        onInputChange={setConfirmText}
        title="Confirm Registration"
        confirmLabel="Register"
      />

      <EditSubjectRegistration
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        students={students}
        subjects={subjects}
        semesters={semesters}
        registration={selectedRegistration || {}}
        setRegistration={setSelectedRegistration}
        onSave={handleSaveEdit}
        onDelete={() => setOpenConfirmDelete(true)}
      />

      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleFinalDelete}
        confirmText={
          students.find(s => s.id === selectedRegistration?.student?._id)?.name?.full_name || ''
        }
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete"
        confirmLabel="Delete"
      />

      {selectedRegistration && (
        <DetailsViewBox
          title="Registration Details"
          data={{
            Student: students.find(s => s.id === selectedRegistration.student._id)?.name?.full_name,
            Subject: subjects.find(s => s.id === selectedRegistration.subject._id)?.name,
            Semester: semesters.find(s => s.id === selectedRegistration.semester._id)?.name
          }}
          createdAt={selectedRegistration.createdAt_timestamp}
          updatedAt={selectedRegistration.updatedAt_timestamp}
        />
      )}

      <LogBox logs={[]} />
      <HelpDrawer open={false} />

    </MainCard>
  );
}
