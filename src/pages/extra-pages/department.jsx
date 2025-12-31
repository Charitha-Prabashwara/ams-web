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
  Fade,
  Drawer,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MainCard from 'components/MainCard';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import HelpDrawer from '../../components/HelpDrawer';
import LogBox from '../../components/LogBox';
import {departmentHelp} from '../../utils/helpDrawerContents';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import ConfirmCreateDialog from '../../components/ConfirmCreateDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
export default function DepartmentPage() {
  const { data, error, isLoading, mutate } = useSWR('/department/find/', fetcher, {
    refreshInterval: 10000
  });

  const departments = data?.departments || [];
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // ---------------- CREATE ----------------
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newDept, setNewDept] = useState({ shortName: '', keyName: '', fullName: '', description: '' });
  const [openConfirmCreateDialog, setOpenConfirmCreateDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleSubmitCreate = () => setOpenConfirmCreateDialog(true);

  const handleFinalCreate = async () => {
    if (confirmText !== newDept.fullName) {
      alert('Typed name does not match the full name!');
      return;
    }
    try {
      await axiosClient.post('/department/', {
        longName: newDept.fullName,
        shortName: newDept.shortName,
        keyName: newDept.keyName,
        description: newDept.description
      });
      mutate();
      setOpenConfirmCreateDialog(false);
      setOpenCreateDialog(false);
      setConfirmText('');
      setNewDept({ shortName: '', keyName: '', fullName: '', description: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create department');
    }
  };

  // ---------------- EDIT & DELETE ----------------
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleOpenEditDialog = (dept) => {
    setSelectedDept({ ...dept }); // clone to avoid direct mutation
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axiosClient.put('/department/id/', {
        id: selectedDept.id,
        shortName: selectedDept.name.short,
        keyName: selectedDept.name.key,
        longName: selectedDept.name.long,
        description: selectedDept.description
      });
      mutate();
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update department');
    }
  };

  const handleFinalDelete = async () => {
    if (deleteText !== selectedDept.name.long) {
      alert('Type correct full name to delete!');
      return;
    }
    try {
      await axiosClient.delete('/department/id/', {
        data: { id: selectedDept.id, safe: true }
      });
      mutate();
      setOpenConfirmDelete(false);
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete department');
    }
  };

  // ---------------- SELECTED DEPARTMENT DETAILS ----------------
  const [selectedDeptDetails, setSelectedDeptDetails] = useState(null);

  // ---------------- HELP DRAWER ----------------
    const [openHelp, setOpenHelp] = useState(false);
    const toggleHelp = () => setOpenHelp(prev => !prev);

  // ---------- Pagination ----------
  const paginatedDepartments = departments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(departments.length / rowsPerPage);

  // ---------- Department Counts ----------
  const { totalActive, totalInactive, totalDeleted } = useMemo(() => {
    let active = 0, inactive = 0, deleted = 0;
    departments.forEach((d) => {
      if (d.isDeleted) deleted++;
      else if (d.isActive) active++;
      else inactive++;
    });
    return { totalActive: active, totalInactive: inactive, totalDeleted: deleted };
  }, [departments]);

   const [logs, setLogs] = useState([
    '[12:00:00] Department IT created successfully.',
    '[12:05:12] Department CS updated.',
    '[12:15:33] Error: Failed to delete department.'
  ]);

  if (error) return <LoadingErrorWrapper isLoading={false} isError={true} />
  if (isLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />
 
  return (
    <MainCard title="Departments">
     

      {/* ----------------- Action Buttons ----------------- */}
      <Box display="flex" justifyContent="flex-end" mb={2} flexWrap="wrap" gap={1}>
        <Button variant="contained" color="error" onClick={null}>
          Recover
        </Button>
        <Button variant="contained" color="success" onClick={handleOpenCreateDialog}>
          New Department
        </Button>
        <Button variant="contained" onClick={toggleHelp}>Open Help</Button>
        <HelpDrawer open={openHelp} onClose={toggleHelp} sections={departmentHelp} title="Department Guidelines" />
      </Box>

      {/* ====================== TABLE ====================== */}
      <TableContainer component={Paper} sx={{ maxHeight: 330, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ceffd3' }}>
              <TableCell align="center">Short Name</TableCell>
              <TableCell align="center">Key</TableCell>
              <TableCell align="center">Full Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDepartments.map((dept) => (
              <TableRow
                key={dept.id}
                hover
                onClick={() => setSelectedDeptDetails(dept)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#e0f7fa' } // all rows hover color
                }}
              >
                <TableCell align="center">{dept.name.short}</TableCell>
                <TableCell align="center">{dept.name.key}</TableCell>
                <TableCell align="center">{dept.name.long}</TableCell>
                <TableCell align="center">
                  <Button
  size="small"
  variant="contained"
  onClick={(e) => {
    e.stopPropagation();
    handleOpenEditDialog(dept);
  }}
  sx={{
    backgroundColor: '#fbc02d',   // yellow
    color: '#000',                // text color (black)
    '&:hover': {
      backgroundColor: '#f9a825' // darker yellow on hover
    }
  }}
>
  Manage
</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ====================== PAGINATION ====================== */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} />
      </Box>

      {/* ====================== SELECTED DEPARTMENT DETAILS ====================== */}
      {selectedDeptDetails && (
        <Box mt={2}  sx={{
      overflowY: 'auto',
      height: '100%',
      p: 2,
      border: 3,                  // thick border
      borderColor: '#97c5ebff',     // blue border
      borderRadius: 2,
      bgcolor: '#e5f1faff',         // very light blue background
    }}>
          <Typography variant="h6" mb={1}>
            Department Details
          </Typography>
          <Typography mb={0.5}><strong>Key:</strong> {selectedDeptDetails.name.key}</Typography>
          <Typography mb={0.5}><strong>Short Name:</strong> {selectedDeptDetails.name.short}</Typography>
          <Typography mb={1}><strong>Full Name:</strong> {selectedDeptDetails.name.long}</Typography>
          <Typography mb={0.5}><strong>Description:</strong> {selectedDeptDetails.description || 'N/A'}</Typography>
          <Typography><strong>Created:</strong> {new Date(selectedDeptDetails.createdAt_timestamp).toLocaleString()}</Typography>
          <Typography><strong>Updated:</strong> {new Date(selectedDeptDetails.updatedAt_timestamp).toLocaleString()}</Typography>
        </Box>
      )}

      

     

      {/* ====================== CREATE DIALOG ====================== */}
      <Dialog open={openCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Department</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={8}>
              <Typography fontWeight="bold">Short Name (max 30)</Typography>
              <TextField
                fullWidth
                value={newDept.shortName}
                inputProps={{ maxLength: 30 }}
                placeholder="Ex: IT"
                onChange={(e) => setNewDept({ ...newDept, shortName: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography fontWeight="bold" align="right">Key (max 10)</Typography>
              <TextField
                fullWidth
                value={newDept.keyName}
                inputProps={{ maxLength: 10 }}
                placeholder="Ex: INF"
                onChange={(e) => setNewDept({ ...newDept, keyName: e.target.value })}
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography fontWeight="bold">Full Name (max 100)</Typography>
            <TextField
              fullWidth
              value={newDept.fullName}
              inputProps={{ maxLength: 100 }}
              placeholder="Ex: Information Technology"
              onChange={(e) => setNewDept({ ...newDept, fullName: e.target.value })}
            />
          </Box>
          <Box mt={3}>
            <Typography fontWeight="bold">Description (max 2000)</Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              value={newDept.description}
              inputProps={{ maxLength: 2000 }}
              placeholder="Enter department description..."
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitCreate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ====================== CONFIRM CREATE ====================== */}
      <Dialog open={openConfirmCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Create Department</DialogTitle>
        <DialogContent dividers>
          <Typography>Please type the full name:</Typography>
          <Typography fontWeight="bold" mt={1} color="blue">{newDept.fullName}</Typography>
          <TextField
            fullWidth
            placeholder="Type exactly here"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmCreateDialog(false)}>Cancel</Button>
          <Button color="success" variant="contained" onClick={handleFinalCreate}>Confirm Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmCreateDialog
      open={openConfirmCreateDialog}
      onClose={() => setOpenConfirmCreateDialog(false)}
      onConfirm={handleFinalCreate}
      confirmText={newDept.fullName}
      inputValue={confirmText}
      onInputChange={setConfirmText}
      title="Confirm Create Department"
      confirmLabel="Create Department"
    />

      {/* ====================== EDIT DIALOG ====================== */}
      <Dialog open={openEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent dividers>
          {selectedDept && (
            <>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={8}>
                  <Typography fontWeight="bold">Short Name</Typography>
                  <TextField
                    fullWidth
                    value={selectedDept.name.short}
                    inputProps={{ maxLength: 30 }}
                    onChange={(e) => setSelectedDept({ ...selectedDept, name: { ...selectedDept.name, short: e.target.value } })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight="bold" align="right">Key</Typography>
                  <TextField
                    fullWidth
                    value={selectedDept.name.key}
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => setSelectedDept({ ...selectedDept, name: { ...selectedDept.name, key: e.target.value } })}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography fontWeight="bold">Full Name</Typography>
                <TextField
                  fullWidth
                  value={selectedDept.name.long}
                  onChange={(e) => setSelectedDept({ ...selectedDept, name: { ...selectedDept.name, long: e.target.value } })}
                />
              </Box>
              <Box mt={3}>
                <Typography fontWeight="bold">Description</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={selectedDept.description || ''}
                  onChange={(e) => setSelectedDept({ ...selectedDept, description: e.target.value })}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenConfirmDelete(true)}>Delete</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>



         <ConfirmDeleteDialog
              open={openConfirmDelete}
              onClose={() => setOpenConfirmDelete(false)}
              onConfirm={handleFinalDelete}
              confirmText={selectedDept?.name.long}
              inputValue={deleteText}
              onInputChange={setDeleteText}
              title="Confirm Delete Department"
              confirmLabel="Delete Department"
            />

      <LogBox logs={logs} />
    </MainCard>
  );
}
