// material-ui
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Pagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Fade
} from '@mui/material';

import MainCard from 'components/MainCard';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import { courseHelp } from '../../utils/helpDrawerContents';
import { showToast } from '../../utils/toast';
import HelpDrawer from '../../components/HelpDrawer';
import LogBox from '../../components/LogBox';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import ConfirmCreateDialog from '../../components/ConfirmCreateDialog';
import CreateBatchDialog from '../../components/CreateBatchDialog';
import DetailsViewBox from '../../components/DetailsViewBox';
import EditBatchDialog from '../../components/EditBatchDialog';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
export default function BatchPage() {
  const { data, error, isLoading, mutate } = useSWR('/batch/find/', fetcher, {
    refreshInterval: 10000
  });

  const batches = data?.batches || [];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // ================= CREATE =================
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    lb: '',
    ub: ''
  });

  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleFinalCreate = async () => {
    if (confirmText !== newBatch.name) {
      alert('Batch name does not match!');
      return;
    }

    try {
      const response = await axiosClient.post('/batch/', {
        name: newBatch.name,
        lb: Number(newBatch.lb),
        ub: Number(newBatch.ub)
      });
      mutate();
      setOpenConfirmCreate(false);
      setOpenCreateDialog(false);
      setConfirmText('');
      setNewBatch({ name: '', lb: '', ub: '' });

      showToast({
        text: response?.data?.message || 'New batch created successfully',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      showToast({
        text: err.response?.data?.message,
        type: 'error'
      });
    }
  };

  // ================= EDIT & DELETE =================
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleSaveEdit = async () => {
    try {
      const response = await axiosClient.put('/batch/id/', {
        id: selectedBatch.id,
        name: selectedBatch.name,
        lb: Number(selectedBatch.academic.lb),
        ub: Number(selectedBatch.academic.ub)
      });
      mutate();
      setOpenEditDialog(false);
      showToast({
        text: response?.data?.message || 'Batch updated successfully',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      showToast({
        text: err.response?.data?.message,
        type: 'error'
      });
    }
  };

  const handleFinalDelete = async () => {
    if (deleteText !== selectedBatch.name) {
      alert('Type correct batch name to delete!');
      return;
    }

    try {
      const response = await axiosClient.delete('/batch/id/', {
        data: { id: selectedBatch.id }
      });
      mutate();
      setOpenConfirmDelete(false);
      setOpenEditDialog(false);

      showToast({
        text: response?.data?.message || 'Batch Deleted successfully',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      showToast({
        text: err.response?.data?.message,
        type: 'error'
      });
    }
  };
  // ---------------- HELP DRAWER ----------------
  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp((prev) => !prev);

  // ================= Pagination =================
  const paginatedBatches = batches.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(batches.length / rowsPerPage);

  // ---------------- SELECTED DEPARTMENT DETAILS ----------------
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);

  const [logs, setLogs] = useState([
    '[12:00:00] Department IT created successfully.',
    '[12:05:12] Department CS updated.',
    '[12:15:33] Error: Failed to delete department.'
  ]);

  if (error) return <LoadingErrorWrapper isLoading={false} isError={true} />;
  if (isLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />;

  return (
    <MainCard title="Batches">
      <UniversalActionBar
        buttons={[
          { label: 'Recover', color: 'error', onClick: () => console.log('Recover clicked') },
          { label: 'New Batch', color: 'success', onClick: setOpenCreateDialog },
          { label: 'Open Help', type: 'help' } // automatically handles drawer
        ]}
        helpDrawer={{
          sections: courseHelp,
          title: 'Batch Guidelines'
        }}
      />

      {/* ================= TABLE ================= */}
      <UniversalTable
        data={paginatedBatches}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowClick={(batch) => setSelectedBatchDetails(batch)}
        columns={[
          { label: 'Batch Name', key: 'name', align: 'left' },
          {
            label: 'Academic Years',
            key: 'academic',
            align: 'left',
            render: (row) => `${row.academic?.lb || 'N/A'} - ${row.academic?.ub || 'N/A'}`
          }
        ]}
        renderActions={(batch) => (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBatch(batch);
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

      <CreateBatchDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        batch={newBatch}
        setBatch={setNewBatch}
        onSave={() => setOpenConfirmCreate(true)}
      />

      {/* ================= CONFIRM CREATE ================= */}

      <ConfirmCreateDialog
        open={openConfirmCreate}
        onClose={() => setOpenConfirmCreate(false)}
        onConfirm={handleFinalCreate}
        confirmText={newBatch.name}
        inputValue={confirmText}
        onInputChange={setConfirmText}
        title="Confirm Create Batch"
        confirmLabel="Create Batch"
      />

      {/* ================= EDIT DIALOG ================= */}

      <EditBatchDialog
        open={openEditDialog}
        batch={selectedBatch}
        onChange={setSelectedBatch}
        onSave={handleSaveEdit}
        onDelete={() => setOpenConfirmDelete(true)}
        onClose={() => setOpenEditDialog(false)}
      />

      {/* ================= CONFIRM DELETE ================= */}
      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleFinalDelete}
        confirmText={selectedBatch?.name}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete Batch"
        confirmLabel="Delete Batch"
      />

      {selectedBatchDetails && (
        <DetailsViewBox
          title="Batch Details"
          data={{
            Name: selectedBatchDetails.name,
            'Academic Years': selectedBatchDetails.academic?.lb + '-' + selectedBatchDetails.academic?.ub
          }}
          createdAt={selectedBatchDetails.createdAt_timestamp}
          updatedAt={selectedBatchDetails.updatedAt_timestamp}
        />
      )}

      <LogBox logs={logs} />
    </MainCard>
  );
}
