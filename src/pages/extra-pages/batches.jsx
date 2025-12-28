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
      await axiosClient.post('/batch/', {
        name: newBatch.name,
        lb: Number(newBatch.lb),
        ub: Number(newBatch.ub)
      });
      mutate();
      setOpenConfirmCreate(false);
      setOpenCreateDialog(false);
      setConfirmText('');
      setNewBatch({ name: '', lb: '', ub: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create batch');
    }
  };

  // ================= EDIT & DELETE =================
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleSaveEdit = async () => {
    try {
      await axiosClient.put('/batch/id/', {
        id: selectedBatch.id,
        name: selectedBatch.name,
        lb: Number(selectedBatch.academic.lb),
        ub: Number(selectedBatch.academic.ub)
      });
      mutate();
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update batch');
    }
  };

  const handleFinalDelete = async () => {
    if (deleteText !== selectedBatch.name) {
      alert('Type correct batch name to delete!');
      return;
    }

    try {
      await axiosClient.delete('/batch/id/', {
        data: { id: selectedBatch.id }
      });
      mutate();
      setOpenConfirmDelete(false);
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete batch');
    }
  };

  // ================= Pagination =================
  const paginatedBatches = batches.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(batches.length / rowsPerPage);

  if (error) return <div>Error loading batches</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title="Batches">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="success" onClick={() => setOpenCreateDialog(true)}>
          New Batch
        </Button>
      </Box>

      {/* ================= TABLE ================= */}
      <TableContainer component={Paper} sx={{ maxHeight: 330 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Batch Name</TableCell>
              <TableCell align="center">Academic Years</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBatches.map((batch, idx) => (
              <TableRow key={batch.id}>
                <TableCell align="center">{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                <TableCell align="center">{batch.name}</TableCell>
                <TableCell align="center">
                  {batch.academic?.lb} - {batch.academic?.ub}
                </TableCell>
                <TableCell align="center">{new Date(batch.createdAt_timestamp).toISOString()}</TableCell>
                <TableCell align="center">{new Date(batch.updatedAt_timestamp).toISOString()}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedBatch(batch);
                      setOpenEditDialog(true);
                    }}
                  >
                    Edit / Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} />
      </Box>

      {/* ================= CREATE DIALOG ================= */}
      <Dialog open={openCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Batch</DialogTitle>
        <DialogContent dividers>
          <Box mt={1}>
            <Typography fontWeight="bold">Batch Name</Typography>
            <TextField fullWidth value={newBatch.name} onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })} />
          </Box>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Lower Bound (Year)</Typography>
              <TextField type="number" fullWidth value={newBatch.lb} onChange={(e) => setNewBatch({ ...newBatch, lb: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Upper Bound (Year)</Typography>
              <TextField type="number" fullWidth value={newBatch.ub} onChange={(e) => setNewBatch({ ...newBatch, ub: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenConfirmCreate(true)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= CONFIRM CREATE ================= */}
      <Dialog open={openConfirmCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Create Batch</DialogTitle>
        <DialogContent dividers>
          <Typography>Type this batch name:</Typography>
          <Typography fontWeight="bold" color="blue">
            {newBatch.name}
          </Typography>
          <TextField fullWidth value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmCreate(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleFinalCreate}>
            Confirm Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={openEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Batch</DialogTitle>
        <DialogContent dividers>
          {selectedBatch && (
            <>
              <Typography fontWeight="bold">Batch Name</Typography>
              <TextField
                fullWidth
                value={selectedBatch.name}
                onChange={(e) => setSelectedBatch({ ...selectedBatch, name: e.target.value })}
              />

              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">Lower Bound</Typography>
                  <TextField
                    type="number"
                    fullWidth
                    value={selectedBatch.academic.lb}
                    onChange={(e) =>
                      setSelectedBatch({
                        ...selectedBatch,
                        academic: { ...selectedBatch.academic, lb: e.target.value }
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">Upper Bound</Typography>
                  <TextField
                    type="number"
                    fullWidth
                    value={selectedBatch.academic.ub}
                    onChange={(e) =>
                      setSelectedBatch({
                        ...selectedBatch,
                        academic: { ...selectedBatch.academic, ub: e.target.value }
                      })
                    }
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenConfirmDelete(true)}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ================= CONFIRM DELETE ================= */}
      <Dialog
        open={openConfirmDelete}
        TransitionComponent={Fade}
        maxWidth={false}
        sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: '90%' } }}
      >
        <DialogTitle>Confirm Delete Batch</DialogTitle>
        <DialogContent dividers>
          <Typography>Type this batch name:</Typography>
          <Typography fontWeight="bold" color="red">
            {selectedBatch?.name}
          </Typography>
          <TextField fullWidth value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleFinalDelete}>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
