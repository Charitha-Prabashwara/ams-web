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
import CreateDepartmentDialog from '../../components/CreateDepartmentDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import DetailsViewBox from '../../components/DetailsViewBox';
import UniversalTable from '../../components/UniversalTable';
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
<UniversalTable
  data={departments}
  columns={[
    { label: 'Key', key: 'name.key', align: 'center' },
    { label: 'Short Name', key: 'name.short', align: 'center' },
    { label: 'Full Name', key: 'name.long', align: 'center' },
  
  ]}
  page={page}
  rowsPerPage={5}
  totalPages={totalPages}
  onPageChange={setPage}
  onRowClick={(dept) => setSelectedDeptDetails(dept)}
  renderActions={(dept) => (
    <Button
      size="small"
      variant="contained"
      onClick={(e) => {
        e.stopPropagation();
        handleOpenEditDialog(dept);
      }}
      sx={{
        backgroundColor: '#fbc02d',
        color: '#000',
        '&:hover': { backgroundColor: '#f9a825' },
      }}
    >
      Manage
    </Button>
  )}
/>




      {/* ====================== SELECTED DEPARTMENT DETAILS ====================== */}
      {selectedDeptDetails &&  
      <DetailsViewBox
      title="Department Details"
      data={{
        "Key": selectedDeptDetails.name.key,
        'Short Name': selectedDeptDetails.name.short,
        'Full Name': selectedDeptDetails.name.long,
        Description: selectedDeptDetails.description 
      }}
      createdAt={selectedDeptDetails.createdAt_timestamp}
      updatedAt={selectedDeptDetails.updatedAt_timestamp}
    />}

         

      {/* ====================== CREATE DIALOG ====================== */}

      <CreateDepartmentDialog
  open={openCreateDialog}
  onClose={() => setOpenCreateDialog(false)}
  department={newDept}
  setDepartment={setNewDept}
  onSave={handleSubmitCreate}
/>

      {/* ====================== CONFIRM CREATE ====================== */}
    
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
