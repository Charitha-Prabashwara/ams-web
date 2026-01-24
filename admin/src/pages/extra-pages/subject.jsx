// material-ui
import {
  Button,
  Box
} from '@mui/material';

import MainCard from 'components/MainCard';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import { showToast } from '../../utils/toast';
import LogBox from '../../components/LogBox';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import ConfirmCreateDialog from '../../components/ConfirmCreateDialog';
import DetailsViewBox from '../../components/DetailsViewBox';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import { subjectHelp } from '../../utils/helpDrawerContents';

// material-ui dialogs
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

export default function SubjectPage() {
  const { data, error, isLoading, mutate } = useSWR('/subject/find/', fetcher, {
    refreshInterval: 10000
  });

  const subjects = data?.subjects || [];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // ================= CREATE =================
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    credits: ''
  });

  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleFinalCreate = async () => {
    if (confirmText !== newSubject.name) {
      alert('Subject name does not match!');
      return;
    }

    try {
      const response = await axiosClient.post('/subject/', {
        name: newSubject.name,
        code: newSubject.code,
        credits: Number(newSubject.credits)
      });

      mutate();
      setOpenConfirmCreate(false);
      setOpenCreateDialog(false);
      setConfirmText('');
      setNewSubject({ name: '', code: '', credits: '' });

      showToast({
        text: response?.data?.message || 'Subject created successfully',
        type: 'success'
      });
    } catch (err) {
      showToast({
        text: err.response?.data?.message,
        type: 'error'
      });
    }
  };

  // ================= EDIT & DELETE =================
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleSaveEdit = async () => {
    try {
      const response = await axiosClient.put('/subject/id/', {
        id: selectedSubject.id,
        name: selectedSubject.name,
        code: selectedSubject.code,
        credits: Number(selectedSubject.credits),
        deleted: selectedSubject.deleted
      });

      mutate();
      setOpenEditDialog(false);

      showToast({
        text: response?.data?.message || 'Subject updated successfully',
        type: 'success'
      });
    } catch (err) {
      showToast({
        text: err.response?.data?.message,
        type: 'error'
      });
    }
  };

  const handleFinalDelete = async () => {
    if (deleteText !== selectedSubject.name) {
      alert('Type correct subject name to delete!');
      return;
    }

    try {
      const response = await axiosClient.delete('/subject/id/', {
        data: { id: selectedSubject.id }
      });

      mutate();
      setOpenConfirmDelete(false);
      setOpenEditDialog(false);

      showToast({
        text: response?.data?.message || 'Subject deleted successfully',
        type: 'success'
      });
    } catch (err) {
      showToast({
        text: err.response?.data?.message,
        type: 'error'
      });
    }
  };

  // ================= Pagination =================
  const paginatedSubjects = subjects.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ================= DETAILS =================
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState(null);

  const [logs] = useState([
    '[12:00:00] Subject created successfully.',
    '[12:05:12] Subject updated.',
    '[12:15:33] Error: Failed to delete subject.'
  ]);

  if (error) return <LoadingErrorWrapper isLoading={false} isError={true} />;
  if (isLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />;

  return (
    <MainCard title="Subjects">
      <UniversalActionBar
        buttons={[
          { label: 'Recover', color: 'error', onClick: () => console.log('Recover clicked') },
          { label: 'New Subject', color: 'success', onClick: () => setOpenCreateDialog(true) },
          { label: 'Open Help', type: 'help' } // automatically handles drawer
        ]}
         helpDrawer={{
                  sections: subjectHelp,
                  title: 'Subject Guidelines'
                }}
      />

      {/* ================= TABLE ================= */}
      <UniversalTable
        data={paginatedSubjects}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowClick={(subject) => setSelectedSubjectDetails(subject)}
        columns={[
          { label: 'Code', key: 'code', align: 'left' },
          { label: 'Name', key: 'name', align: 'left' },
          { label: 'Credits', key: 'credits', align: 'center' }
        ]}
        renderActions={(subject) => (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubject(subject);
              setOpenEditDialog(true);
            }}
            sx={{
              backgroundColor: '#fbc02d',
              color: '#000',
              '&:hover': { backgroundColor: '#f9a825' }
            }}
          >
            Manage
          </Button>
        )}
      />

      {/* ================= CREATE DIALOG ================= */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth>
        <DialogTitle>Create Subject</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Subject Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Subject Code"
            value={newSubject.code}
            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Credits"
            type="number"
            value={newSubject.credits}
            onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenConfirmCreate(true)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= CONFIRM CREATE ================= */}
      <ConfirmCreateDialog
        open={openConfirmCreate}
        onClose={() => setOpenConfirmCreate(false)}
        onConfirm={handleFinalCreate}
        confirmText={newSubject.name}
        inputValue={confirmText}
        onInputChange={setConfirmText}
        title="Confirm Create Subject"
        confirmLabel="Create Subject"
      />

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Subject Name"
            value={selectedSubject?.name || ''}
            onChange={(e) => setSelectedSubject({ ...selectedSubject, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Subject Code"
            value={selectedSubject?.code || ''}
            onChange={(e) => setSelectedSubject({ ...selectedSubject, code: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Credits"
            type="number"
            value={selectedSubject?.credits || ''}
            onChange={(e) => setSelectedSubject({ ...selectedSubject, credits: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenConfirmDelete(true)}>
            Delete
          </Button>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= CONFIRM DELETE ================= */}
      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleFinalDelete}
        confirmText={selectedSubject?.name}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete Subject"
        confirmLabel="Delete Subject"
      />

      {selectedSubjectDetails && (
        <DetailsViewBox
          title="Subject Details"
          data={{
            Code: selectedSubjectDetails.code,
            Name: selectedSubjectDetails.name,
            Credits: selectedSubjectDetails.credits
          }}
          createdAt={selectedSubjectDetails.createdAt_timestamp}
          updatedAt={selectedSubjectDetails.updatedAt_timestamp}
        />
      )}

      {/* <LogBox logs={logs} /> */}
    </MainCard>
  );
}
