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
  MenuItem,
  Fade
} from '@mui/material';

import MainCard from 'components/MainCard';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';

export default function CoursePage() {
  const { data, isLoading, error, mutate } = useSWR('/course/find/', fetcher);
  const { data: deptData } = useSWR('/department/find/', fetcher);

  const courses = data?.courses || [];
  const departments = deptData?.departments || [];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // ---------------- CREATE ----------------
  const [openCreate, setOpenCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: ''
  });

  // ---------------- EDIT & DELETE ----------------
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  // ---------------- HANDLERS ----------------
  const handleCreate = async () => {
    try {
      await axiosClient.post('/course/', newCourse);
      mutate();
      setOpenCreate(false);
      setNewCourse({ code: '', name: '', department: '' });
    } catch (e) {
      alert('Failed to create course');
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosClient.put('/course/id/', {
        id: selectedCourse.id,
        code: selectedCourse.code,
        name: selectedCourse.name,
        department: selectedCourse.department._id,
        isActive: selectedCourse.isActive
      });
      mutate();
      setOpenEdit(false);
    } catch {
      alert('Failed to update course');
    }
  };

  const handleDelete = async () => {
    if (deleteText !== selectedCourse.code) {
      alert('Type correct course code');
      return;
    }

    try {
      await axiosClient.delete('/course/id/', {
        data: { id: selectedCourse.id }
      });
      mutate();
      setOpenConfirmDelete(false);
      setOpenEdit(false);
    } catch {
      alert('Failed to delete course');
    }
  };

  // ---------------- PAGINATION ----------------
  const paginated = courses.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(courses.length / rowsPerPage);

  if (error) return <div>Error loading courses</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title="Courses">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="success" onClick={() => setOpenCreate(true)}>
          New Course
        </Button>
      </Box>

      {/* ================= TABLE ================= */}
      <TableContainer component={Paper} sx={{ maxHeight: 330 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((course, idx) => (
              <TableRow key={course.id}>
                <TableCell align="center">{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                <TableCell align="center">{course.code}</TableCell>
                <TableCell align="center">{course.name}</TableCell>
                <TableCell align="center">{course.department?.name?.short}</TableCell>
                <TableCell align="center">{course.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell align="center">{new Date(course.createdAt_timestamp).toISOString()}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedCourse(course);
                      setOpenEdit(true);
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

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
      </Box>

      {/* ====================== CREATE COURSE DIALOG ====================== */}
      <Dialog open={openCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>

        <DialogContent dividers>
          {/* ================= ROW 1: CODE + NAME ================= */}
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            {/* Course Code */}
            <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
              <Typography fontWeight="bold">Course Code</Typography>
              <TextField
                fullWidth
                placeholder="Ex: IT101"
                value={newCourse.code}
                inputProps={{ maxLength: 15 }}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
              />
            </Box>

            {/* Course Name */}
            <Box flex="1">
              <Typography fontWeight="bold">Course Name</Typography>
              <TextField
                fullWidth
                placeholder="Ex: Introduction to IT"
                value={newCourse.name}
                inputProps={{ maxLength: 150 }}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </Box>
          </Box>

          {/* ================= ROW 2: DEPARTMENT ================= */}
          <Box mt={2}>
            <Typography fontWeight="bold">Department</Typography>
            <TextField
              select
              fullWidth
              value={newCourse.department}
              onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name.long}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Close</Button>
          <Button variant="contained" onClick={handleCreate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ====================== EDIT DIALOG ====================== */}
      {/* ====================== EDIT COURSE DIALOG ====================== */}
      <Dialog open={openEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>

        <DialogContent dividers>
          {selectedCourse && (
            <>
              {/* ================= ROW 1: CODE + NAME ================= */}
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                {/* Course Code */}
                <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
                  <Typography fontWeight="bold">Code</Typography>
                  <TextField
                    fullWidth
                    value={selectedCourse.code}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, code: e.target.value.toUpperCase() })}
                  />
                </Box>

                {/* Course Name */}
                <Box flex="1">
                  <Typography fontWeight="bold">Course Name</Typography>
                  <TextField
                    fullWidth
                    value={selectedCourse.name}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
                  />
                </Box>
              </Box>

              {/* ================= ROW 2: DEPARTMENT ================= */}
              <Box mt={2}>
                <Typography fontWeight="bold">Department</Typography>
                <TextField
                  select
                  fullWidth
                  value={selectedCourse.department?._id || ''}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      department: { ...selectedCourse.department, _id: e.target.value }
                    })
                  }
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name.long}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* ================= ROW 3: ACTIVE ================= */}
              <Box mt={2}>
                <Typography fontWeight="bold">Active</Typography>
                <TextField
                  select
                  fullWidth
                  value={selectedCourse.isActive}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, isActive: e.target.value === 'true' })}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={() => setOpenConfirmDelete(true)}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
          <Button onClick={() => setOpenEdit(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ================= CONFIRM DELETE ================= */}
      <Dialog open={openConfirmDelete} TransitionComponent={Fade} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>Type course code to delete:</Typography>
          <Typography fontWeight="bold" color="red">
            {selectedCourse?.code}
          </Typography>
          <TextField fullWidth value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
