// SemesterPage.jsx
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

export default function SemesterPage() {
  const { data, error, isLoading, mutate } = useSWR('/semester/find/', fetcher, {
    refreshInterval: 10000
  });

  const semesters = data?.semesters || [];
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // ---------------- CREATE ----------------
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newSemester, setNewSemester] = useState({ code: '', name: '', department: '', course: '', batch: '' });

  const [openConfirmCreateDialog, setOpenConfirmCreateDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleSubmitCreate = () => setOpenConfirmCreateDialog(true);

  const handleFinalCreate = async () => {
    if (confirmText !== newSemester.name) {
      alert('Typed name does not match the semester name!');
      return;
    }
    try {
      await axiosClient.post('/semester/', newSemester);
      mutate();
      setOpenConfirmCreateDialog(false);
      setOpenCreateDialog(false);
      setConfirmText('');
      setNewSemester({ code: '', name: '', department: '', course: '', batch: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create semester');
    }
  };

  // ---------------- EDIT & DELETE ----------------
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleOpenEditDialog = (semester) => {
    setSelectedSemester(semester);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axiosClient.put('/semester/id/', selectedSemester);
      mutate();
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update semester');
    }
  };

  const handleFinalDelete = async () => {
    if (deleteText !== selectedSemester.name) {
      alert('Type correct semester name to delete!');
      return;
    }
    try {
      await axiosClient.delete('/semester/id/', { data: { id: selectedSemester.id } });
      mutate();
      setOpenConfirmDelete(false);
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete semester');
    }
  };

  // ---------- Pagination Data ----------
  const paginatedSemesters = semesters.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(semesters.length / rowsPerPage);

  if (error) return <div>Error loading semesters</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title="Semesters">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="success" onClick={handleOpenCreateDialog}>
          New Semester
        </Button>
      </Box>

      {/* ====================== TABLE ===================== */}
      <TableContainer component={Paper} sx={{ maxHeight: 330, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ceffd3' }}>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Course</TableCell>
              <TableCell align="center">Batch</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSemesters.map((sem, idx) => (
              <TableRow key={sem.id}>
                <TableCell align="center">{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                <TableCell align="center">{sem.code}</TableCell>
                <TableCell align="center">{sem.name}</TableCell>
                <TableCell align="center">{sem.department}</TableCell>
                <TableCell align="center">{sem.course}</TableCell>
                <TableCell align="center">{sem.batch}</TableCell>
                <TableCell align="center">{new Date(sem.createdAt_timestamp).toISOString()}</TableCell>
                <TableCell align="center">{new Date(sem.updatedAt_timestamp).toISOString()}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" onClick={() => handleOpenEditDialog(sem)}>
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

      {/* ====================== CREATE DIALOG ====================== */}
      <Dialog open={openCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Semester</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Code</Typography>
              <TextField
                fullWidth
                value={newSemester.code}
                placeholder="Ex: SEM2522"
                onChange={(e) => setNewSemester({ ...newSemester, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Name</Typography>
              <TextField
                fullWidth
                value={newSemester.name}
                placeholder="Ex: Second semester of..."
                onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Department ID</Typography>
              <TextField
                fullWidth
                value={newSemester.department}
                onChange={(e) => setNewSemester({ ...newSemester, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Course ID</Typography>
              <TextField
                fullWidth
                value={newSemester.course}
                onChange={(e) => setNewSemester({ ...newSemester, course: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Batch ID</Typography>
              <TextField
                fullWidth
                value={newSemester.batch}
                onChange={(e) => setNewSemester({ ...newSemester, batch: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitCreate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ====================== CONFIRM CREATE ====================== */}
      <Dialog open={openConfirmCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Create Semester</DialogTitle>
        <DialogContent dividers>
          <Typography>Please type the semester name to confirm:</Typography>
          <Typography fontWeight="bold" mt={1} color="blue">
            {newSemester.name}
          </Typography>
          <TextField fullWidth placeholder="Type exactly here" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmCreateDialog(false)}>Cancel</Button>
          <Button color="success" variant="contained" onClick={handleFinalCreate}>
            Confirm Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ====================== EDIT DIALOG ====================== */}
      <Dialog open={openEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Semester</DialogTitle>
        <DialogContent dividers>
          {selectedSemester && (
            <>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">Code</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.code}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, code: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">Name</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.name}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, name: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={4}>
                  <Typography fontWeight="bold">Department ID</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.department}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, department: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight="bold">Course ID</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.course}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, course: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight="bold">Batch ID</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.batch}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, batch: e.target.value })}
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

      {/* ====================== CONFIRM DELETE ====================== */}
      <Dialog
        open={openConfirmDelete}
        TransitionComponent={Fade}
        transitionDuration={200}
        maxWidth={false}
        fullWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            width: 600,
            maxWidth: '90%'
          }
        }}
      >
        <DialogTitle>Confirm Delete Semester</DialogTitle>
        <DialogContent dividers>
          <Typography>Type this semester name to delete:</Typography>
          <Typography fontWeight="bold" mt={1} color="red">
            {selectedSemester?.name}
          </Typography>
          <TextField fullWidth placeholder="Type exactly here" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
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
