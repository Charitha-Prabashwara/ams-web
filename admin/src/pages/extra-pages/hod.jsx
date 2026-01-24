// material-ui
import {
  Typography,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { useState } from 'react';
import CreateHODDialog from '../../components/CreateHODDialog';

export default function HeadOfDepartmentPage() {
  const initialDepartments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

  // ---------- Dummy HOD Data ----------
  const [departmentHeads, setDepartmentHeads] = useState([
    {
      id: 1,
      name: 'DR. CHARITHA PERERA',
      fullName: 'DR. CHARITHA PERERA',
      nameWithInitial: 'D. PERERA',
      email: 'charitha.perera@uni.edu',
      department: 'Computer Science',
      departmentId: 'Computer Science',
      phone: '+94 77 1234567',
      status: 'active'
    },
    {
      id: 2,
      name: 'DR. SANDUNI RATHNAYAKE',
      fullName: 'DR. SANDUNI RATHNAYAKE',
      nameWithInitial: 'S. RATHNAYAKE',
      email: 'sanduni.rathnayake@uni.edu',
      department: 'Mathematics',
      departmentId: 'Mathematics',
      phone: '+94 77 2345678',
      status: 'active'
    },
    {
      id: 3,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 4,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 5,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 6,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 7,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 8,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 9,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 10,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 11,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    },
    {
      id: 12,
      name: 'DR. THARINDU GUNAWARDENA',
      fullName: 'DR. THARINDU GUNAWARDENA',
      nameWithInitial: 'T. GUNAWARDENA',
      email: 'tharindu.gunawardena@uni.edu',
      department: 'Physics',
      departmentId: 'Physics',
      phone: '+94 77 3456789',
      status: 'active'
    }
  ]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ---------- CREATE NEW HOD ----------
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newHOD, setNewHOD] = useState({
    registrationId: '',
    firstName: '',
    lastName: '',
    fullName: '',
    nameWithInitial: '',
    email: '',
    addressLine1: '',
    addressZip: '',
    type: 'admin',
    departmentId: '',
    password: '',
    confirmPassword: ''
  });

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewHOD({
      registrationId: '',
      firstName: '',
      lastName: '',
      fullName: '',
      nameWithInitial: '',
      email: '',
      addressLine1: '',
      addressZip: '',
      type: 'admin',
      departmentId: '',
      password: '',
      confirmPassword: ''
    });
  };
  const handleCreateInputChange = (field, value) => {
    setNewHOD({ ...newHOD, [field]: value });
    if (field === 'firstName' || field === 'lastName') {
      const firstName = field === 'firstName' ? value : newHOD.firstName;
      const lastName = field === 'lastName' ? value : newHOD.lastName;
      setNewHOD((prev) => ({
        ...prev,
        fullName: `${firstName} ${lastName}`.toUpperCase(),
        nameWithInitial: `${firstName[0].toUpperCase()}. ${lastName.toUpperCase()}`
      }));
    }
  };
  const handleCreateHOD = () => {
    setDepartmentHeads((prev) => [...prev, { ...newHOD, id: Date.now(), status: 'active', department: newHOD.departmentId }]);
    handleCloseCreateDialog();
  };

  // ---------- EDIT / VIEW HOD ----------
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState(null);
  const [editData, setEditData] = useState({});

  const handleOpenEditDialog = (hod) => {
    setSelectedHOD(hod);
    setEditData(hod);
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedHOD(null);
  };
  const handleEditInputChange = (field, value) => setEditData({ ...editData, [field]: value });
  const handleSaveEdit = () => {
    setDepartmentHeads((prev) => prev.map((hod) => (hod.id === editData.id ? editData : hod)));
    handleCloseEditDialog();
  };
  const handleSuspend = () => setEditData({ ...editData, status: editData.status === 'active' ? 'suspended' : 'active' });
  const handleDelete = () => {
    setDepartmentHeads((prev) => prev.filter((hod) => hod.id !== editData.id));
    handleCloseEditDialog();
  };

  // ---------- Pagination ----------
  const handleChangePage = (event, value) => setPage(value);
  const handleChangeRowsPerPage = (event) => {
    const value = Number(event.target.value);
    if (value > 0) setRowsPerPage(value);
  };

  const paginatedHeads = departmentHeads.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(departmentHeads.length / rowsPerPage);

  return (
    <MainCard title="Head of Departments">
      {/* Top Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" color="success" onClick={handleOpenCreateDialog}>
          Create HOD
        </Button>
        <TextField
          label="Items per page"
          type="number"
          size="small"
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          inputProps={{ min: 1 }}
        />
      </Box>

      {/* Department Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 330, // Adjust height as needed
          overflowY: 'auto'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#60d2195b', color: '#fff' }}>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Full Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHeads.map((head, index) => (
              <TableRow key={head.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{head.fullName}</TableCell>
                <TableCell>{head.email}</TableCell>
                <TableCell>{head.departmentId}</TableCell>
                <TableCell>{head.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleOpenEditDialog(head)}>
                    View / Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
      </Box>

      {/* ---------- CREATE HOD DIALOG ----------
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Department Head</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Registration ID"
              value={newHOD.registrationId}
              onChange={(e) => handleCreateInputChange('registrationId', e.target.value)}
              fullWidth
            />
            <TextField
              label="First Name"
              value={newHOD.firstName}
              onChange={(e) => handleCreateInputChange('firstName', e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={newHOD.lastName}
              onChange={(e) => handleCreateInputChange('lastName', e.target.value)}
              fullWidth
            />
            <TextField label="Email" value={newHOD.email} onChange={(e) => handleCreateInputChange('email', e.target.value)} fullWidth />
            <TextField
              label="Address Line 1"
              value={newHOD.addressLine1}
              onChange={(e) => handleCreateInputChange('addressLine1', e.target.value)}
              fullWidth
            />
            <TextField
              label="ZIP Code"
              value={newHOD.addressZip}
              onChange={(e) => handleCreateInputChange('addressZip', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={newHOD.departmentId}
                label="Department"
                onChange={(e) => handleCreateInputChange('departmentId', e.target.value)}
              >
                {initialDepartments.map((dept, idx) => (
                  <MenuItem key={idx} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Password"
              type="password"
              value={newHOD.password}
              onChange={(e) => handleCreateInputChange('password', e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={newHOD.confirmPassword}
              onChange={(e) => handleCreateInputChange('confirmPassword', e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateHOD} variant="contained" color="primary">
            Create
          </Button>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
     */}

      <CreateHODDialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        onCreate={handleCreateHOD}
        newHOD={newHOD}
        setNewHOD={setNewHOD}
        departments={initialDepartments}
      />

      {/* ---------- EDIT / VIEW HOD DIALOG ---------- */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit / View HOD</DialogTitle>
        <DialogContent>
          {selectedHOD && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField label="Name" value={editData.name} onChange={(e) => handleEditInputChange('name', e.target.value)} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={editData.department}
                  label="Department"
                  onChange={(e) => handleEditInputChange('department', e.target.value)}
                >
                  {initialDepartments.map((dept, idx) => (
                    <MenuItem key={idx} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Email" value={editData.email} onChange={(e) => handleEditInputChange('email', e.target.value)} fullWidth />
              <TextField label="Phone" value={editData.phone} onChange={(e) => handleEditInputChange('phone', e.target.value)} fullWidth />
              <Typography>Status: {editData.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuspend} color={editData?.status === 'active' ? 'warning' : 'success'}>
            {editData?.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={handleCloseEditDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
