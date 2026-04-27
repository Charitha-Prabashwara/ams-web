// LecturerSubjectRegistrationPage.jsx
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
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
import CreateLecturerSubjectRegistration from '../../components/CreateLecturerSubjectRegistration';
import EditLecturerSubjectRegistration from '../../components/EditLecturerSubjectRegistration';

export default function LecturerSubjectRegistrationPage() {
  // ---------- SWR DATA ----------
  const { data: lecturersData, error: lecturersError, isLoading: lecturersLoading, mutate: mutateLecturers } = useSWR('/lecturer/find/', fetcher);
  const { data: subjectsData, error: subjectsError, isLoading: subjectsLoading, mutate: mutateSubjects } = useSWR(['/subject/find/'], fetcher);
  const { data: registrationsData, error: regError, isLoading: regLoading, mutate: mutateRegistrations } = useSWR(['/lecturer-subject-registration/find/'], fetcher, { refreshInterval: 1000 });
  
  
  const lecturers = lecturersData?.data?.users || [];
 
  const subjects = subjectsData?.subjects || [];
  const registrations = registrationsData?.registrations || [];
 
  
  // ---------- CREATE ----------
  const [openCreate, setOpenCreate] = useState(false);
  const [newRegistration, setNewRegistration] = useState({ lecturer: '', subject: '' });
  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleFinalCreate = async () => {
    // const lecturerName = lecturers.find(l => l.id === newRegistration.lecturer)?.name || '';
    // if (confirmText !== lecturerName) {
    //   alert('Typed lecturer name does not match!');
    //   return;
    // }
    try {
      const response = await axiosClient.post('/lecturer-subject-registration/', newRegistration);
      mutateRegistrations();
      mutateLecturers();
      mutateRegistrations();
      setOpenCreate(false);
      setOpenConfirmCreate(false);
      setNewRegistration({ lecturer: '', subject: '' });
      setConfirmText('');

    
      
      showToast({ text: 'Lecturer registered successfully!', type: 'success' });
    } catch (err) {
     
      showToast({ text: err.response?.data?.message || 'Failed to register', type: 'error' });
    }
  };

  // ---------- EDIT & DELETE ----------
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleSaveEdit = async () => {
    try {
      delete selectedRegistration.updatedAt_timestamp;
      delete selectedRegistration.createdAt_timestamp;
      console.log({id: selectedRegistration.id, lecturer: selectedRegistration?.lecturer?._id, subject: selectedRegistration?.subject?._id})

     
      await axiosClient.put('/lecturer-subject-registration/id/', {id: selectedRegistration.id, lecturer: selectedRegistration?.lecturer?._id, subject: selectedRegistration?.subject});
      mutateRegistrations();
      setOpenEdit(false);
      showToast({ text: 'Registration updated successfully!', type: 'success' });
    } catch (err) {
     
      showToast({ text: err.response?.data?.message || 'Failed to update', type: 'error' });
    }
  };

  const handleFinalDelete = async () => {
   
    try {
      await axiosClient.delete('lecturer-subject-registration/id/', { data: { id: selectedRegistration.id } });
      mutateRegistrations();
      setOpenEdit(false);
      setOpenConfirmDelete(false);
      showToast({ text: 'Registration deleted successfully!', type: 'success' });
    } catch (err) {
      console.log(err)
      showToast({ text: err.response?.data?.message || 'Failed to delete', type: 'error' });
    }
  };

  // ---------- HELP ----------
  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp(prev => !prev);

  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const paginatedRegs = registrations.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ---------- LOGS ----------
  const [logs, setLogs] = useState([
    '[12:00:00] Lecturer John assigned to Math',
    '[12:10:22] Lecturer Alice assigned to CS',
    '[12:20:45] Error: Duplicate registration'
  ]);

  useEffect(()=>{
    mutateLecturers();
    mutateRegistrations();
    mutateSubjects();
  },[])

  if ( subjectsError || regError || lecturersError) return <LoadingErrorWrapper isLoading={false} isError={true} />;
  if ( subjectsLoading || regLoading || lecturersLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />;




  return (
    <MainCard title="Lecturer Subject Registrations">
      <UniversalActionBar
        buttons={[
          { label: 'Recover', color: 'error', onClick: () => console.log('Recover clicked') },
          { label: 'New Registration', color: 'success', onClick: () => setOpenCreate(true) },
          { label: 'Open Help', type: 'help' }
        ]}
        helpDrawer={{ sections: courseHelp, title: 'Lecturer Subject Registration Guidelines' }}
      />

      <UniversalTable
        data={paginatedRegs}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowClick={setSelectedRegistration}
        columns={[
          { label: 'Lecturer', key: 'lecturer', render: (row)=>{ 
            const lecturer = lecturers.find(l => l.id === row.lecturer._id)
            const full_name =  lecturer?.name?.full_name
            const registration_id = lecturer?.registration_id
            return (registration_id + " | " + full_name) || '-'
          }},
          { label: 'Subject', key: 'subject', render: (row) =>{
            const subject =  subjects.find(s => s.id === row.subject._id);
            const code = subject?.code;
            const name = subject?.name;
            return (code + " | " + name) || '-'
          } }
        ]}
        renderActions={(reg) => (
          <Button
            size="small"
            variant="contained"
            sx={{ backgroundColor: '#fbc02d', color: '#000', '&:hover': { backgroundColor: '#f9a825' } }}
            onClick={e => { e.stopPropagation(); setSelectedRegistration(reg); setOpenEdit(true); }}
          >
            Manage
          </Button>
        )}
      />

      <CreateLecturerSubjectRegistration
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        lecturers={lecturers}
        subjects={subjects}
        registration={newRegistration}
        setRegistration={setNewRegistration}
        onRegisterClick={() => setOpenConfirmCreate(true)} // parent handles confirm dialog
      />

      {/* CONFIRM CREATE */}
      <ConfirmCreateDialog
        open={openConfirmCreate}
        onClose={() => setOpenConfirmCreate(false)}
        onConfirm={handleFinalCreate}
        confirmText={lecturers.find(l => l.id === newRegistration.lecturer)?.name?.full_name || ''}
        inputValue={confirmText}
        onInputChange={setConfirmText}
        title="Confirm Registration"
        confirmLabel="Register"
      />

      {/* EDIT DIALOG */}
      {/* <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              select
              label="Lecturer"
              value={selectedRegistration?.lecturer || ''}
              onChange={e => setSelectedRegistration({ ...selectedRegistration, lecturer: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select Lecturer</option>
              {lecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </TextField>

            <TextField
              select
              label="Subject"
              value={selectedRegistration?.subject || ''}
              onChange={e => setSelectedRegistration({ ...selectedRegistration, subject: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSaveEdit}>Save</Button>
          <Button variant="contained" color="error" onClick={() => setOpenConfirmDelete(true)}>Delete</Button>
        </DialogActions>
      </Dialog> */}

      <EditLecturerSubjectRegistration
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          lecturers={lecturers}
          subjects={subjects}
          registration={selectedRegistration || { lecturer: '', subject: '' }}
          setRegistration={setSelectedRegistration}
          onSave={handleSaveEdit}          // API call + toast stays in parent
          onDelete={() => setOpenConfirmDelete(true)} // triggers confirm delete dialog
      />

      {/* CONFIRM DELETE */}
      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleFinalDelete}
        confirmText={lecturers.find(l => l.id === selectedRegistration?.lecturer._id)?.name?.full_name || ''}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete Registration"
        confirmLabel="Delete"
      />

      {/* SELECTED DETAILS */}
      {selectedRegistration && (
        <DetailsViewBox
          title="Registration Details"
          data={{
            Lecturer: lecturers.find(l => l.id === selectedRegistration?.lecturer._id)?.name?.full_name || '-',
            Subject: subjects.find(s => s.id === selectedRegistration.subject._id)?.name || '-'
          }}
          createdAt={selectedRegistration.createdAt_timestamp}
          updatedAt={selectedRegistration.updatedAt_timestamp}
        />
      )}

      {/* LOGS */}
      {/* <LogBox logs={logs} /> */}

      {/* HELP */}
      <HelpDrawer open={openHelp} onClose={toggleHelp} sections={courseHelp} title="Lecturer Subject Registration Help" />
    </MainCard>
  );
}
