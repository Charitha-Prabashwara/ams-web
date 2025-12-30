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
  const handleToggleHelp = () => setOpenHelp(!openHelp);

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

  if (error) return <div>Error loading departments</div>;
  if (isLoading) return <div>Loading...</div>;

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
        <Button
          variant="outlined"
          color="primary"
          startIcon={<HelpOutlineIcon />}
          onClick={handleToggleHelp}
        >
          Help
        </Button>
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
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDialog(dept);
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

       {/* ====================== HELP DRAWER ====================== */}
      <Drawer
        anchor="right"
        open={openHelp}
        onClose={handleToggleHelp}
        variant="temporary"
        PaperProps={{
          sx: { width: { xs: '80%', sm: 400 }, p: 2 }
        }}
        
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Department Guidelines</Typography>
          <IconButton onClick={handleToggleHelp}>✖</IconButton>
        </Box>
<Box sx={{ overflowY: 'auto', height: '100%', p: 2 }}>
  {/* Section 1: What is a Department */}
  <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
    1. What is a Department
  </Typography>
  <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
    A department represents a specific unit or division within the institution, such as "Information Technology" or "Mathematics". 
    Each department organizes related courses, staff, and students under a unique identity. Properly maintaining departments ensures smooth academic and administrative operations.
  </Typography>

  {/* Section 2: How to Maintain Departments */}
  <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
    2. How to Maintain Departments
  </Typography>
  <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
    - Each department should have a unique full name and a short name used for internal references.<br/>
    - Key names should be concise (maximum 10 characters) and easily identifiable.<br/>
    - Provide a clear and detailed description for each department to facilitate administration and reporting.<br/>
    - Ensure that the department’s active status is correctly set to reflect availability for courses and assignments.
  </Typography>

  {/* Section 3: How to Update Departments */}
  <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
    3. How to Update Departments
  </Typography>
  <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
    - Select the department you want to update from the list.<br/>
    - Click "Edit" to modify the short name, key, full name, or description.<br/>
    - After making changes, click "Save" to apply updates.<br/>
    - Always verify that the updated names are unique and comply with internal naming conventions to avoid conflicts.
  </Typography>

  {/* Section 4: How to Delete Departments */}
  <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
    4. How to Delete Departments
  </Typography>
  <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
    - Only inactive or obsolete departments should be deleted.<br/>
    - To delete, select the department and click "Delete".<br/>
    - Confirm the department’s full name to prevent accidental deletion.<br/>
    - Deleted departments can be restored by administrators if required.
  </Typography>

  {/* Section 5: Maintaining System Integrity & Application Safety */}
  <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
    5. Maintaining System Integrity & Application Safety
  </Typography>
  <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
    - Ensure that department names and keys are unique to prevent conflicts in course assignments and reports.<br/>
    - Avoid using special characters in names or keys that may break system logic.<br/>
    - Always confirm changes before saving or deleting departments to maintain accurate records.<br/>
    - Keep the system secure by granting modification permissions only to authorized personnel.<br/>
    - Regularly review departments to ensure that inactive or redundant departments do not interfere with active operations.
  </Typography>

  {/* Section 6: Contact Information */}
  <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
    6. Contact Information
  </Typography>
  <Typography variant="body2" mb={1} sx={{ textAlign: 'justify' }}>
    For any questions or further guidance regarding department management, please contact the system administrator.
  </Typography>
</Box>

      </Drawer>

      {/* ====================== LOG DATA BOX ====================== */}
<Box
  mt={3}
  p={2}
  border="1px solid #ddd"
  borderRadius={0}
  bgcolor="#f5f5f5"
  sx={{ 
    height: 200,       // fixed height for scrolling
    overflowY: 'auto', // scroll if content exceeds height
    fontFamily: 'monospace',
    fontSize: 14
  }}
>
  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
    Log / Debug Data
  </Typography>
  {/* Replace this with dynamic log content */}
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
  <Typography>
    {`[12:00:00] Department IT created successfully.\n[12:05:12] Department CS updated.\n[12:15:33] Error: Failed to delete department.`}
  </Typography>
</Box>


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

      {/* ====================== CONFIRM DELETE ====================== */}
      <Dialog
        open={openConfirmDelete}
        TransitionComponent={Fade}
        transitionDuration={200}
        maxWidth={false}
        fullWidth={false}
        sx={{ '& .MuiDialog-paper': { width: 600, maxWidth: '90%' } }}
      >
        <DialogTitle>Confirm Delete Department</DialogTitle>
        <DialogContent dividers>
          <Typography>Type this name to delete:</Typography>
          <Typography fontWeight="bold" mt={1} color="red">{selectedDept?.name.long}</Typography>
          <TextField fullWidth placeholder="Type exactly here" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleFinalDelete}>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
