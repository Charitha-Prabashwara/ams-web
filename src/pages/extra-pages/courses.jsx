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
  Typography,
  MenuItem,
  Fade
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import { showToast } from '../../utils/toast';
import HelpDrawer from '../../components/HelpDrawer';
import LogBox from '../../components/LogBox';
import {courseHelp} from '../../utils/helpDrawerContents';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import DetailsViewBox from '../../components/DetailsViewBox';

export default function CoursePage() {
  const { data, isLoading, error, mutate } = useSWR('/course/find/', fetcher);
  const { data: deptData } = useSWR('/department/find/', fetcher);

  const courses = data?.courses || [];
  const departments = deptData?.departments || [];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // ---------------- CREATE ----------------
  const [openCreate, setOpenCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({code: '',name: '',department: ''});

  // ---------------- EDIT & DELETE ----------------
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  // ---------------- DETAILS BOX ----------------
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // ---------------- HANDLERS ----------------
  const handleCreate = async () => {
    try {
      const response = await axiosClient.post('/course/', newCourse);
      mutate();
      setOpenCreate(false);
      setNewCourse({ code: '', name: '', department: '' });
      showToast({
        text: response.data.message || 'Course created successfully',
        type: 'success',
      });
    } catch (e) {
      showToast({
        text: e.response?.data?.message || 'Error creating course',
        type: 'error',
      });
    }
  };

    // ---------------- HELP DRAWER ----------------
    const [openHelp, setOpenHelp] = useState(false);
    const toggleHelp = () => setOpenHelp(prev => !prev);

  const handleUpdate = async () => {
    try {
      const response = await axiosClient.put('/course/id/', {
        id: selectedCourse.id,
        code: selectedCourse.code,
        name: selectedCourse.name,
        department: selectedCourse.department._id,
        isActive: selectedCourse.isActive
      });
      mutate();
      setOpenEdit(false);
      showToast({
        text: response.data.message || 'Course updated successfully',
        type: 'success',
      });
    } catch {
     showToast({
        text: e.response?.data?.message || 'Error creating course',
        type: 'error',
      });
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

 const [logs, setLogs] = useState([
    '[12:00:00] Department IT created successfully.',
    '[12:05:12] Department CS updated.',
    '[12:15:33] Error: Failed to delete department.'
  ]);

  // ---------------- PAGINATION ----------------
  const paginated = courses.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(courses.length / rowsPerPage);

  if (error) return <LoadingErrorWrapper isLoading={false} isError={true} />
  if (isLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />

  return (
    <MainCard title="Courses">
      
      <Box display="flex" justifyContent="flex-end" mb={2} flexWrap="wrap" gap={1}>
        <Button variant="contained" color="error" onClick={null}>Recover</Button>
        <Button variant="contained" color="success" onClick={() => setOpenCreate(true)}>New Course</Button>
        <Button variant="contained" onClick={toggleHelp}>Open Help</Button>
        <HelpDrawer open={openHelp} onClose={toggleHelp} sections={courseHelp} title="Course Guidelines" />
      </Box>

      {/* ================= TABLE ================= */}
      <TableContainer component={Paper} sx={{ maxHeight: 330 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((course) => (
              <TableRow
                key={course.id}
                hover
                onClick={() => setSelectedCourseDetails(course)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0f7fa' } }}
              >
                <TableCell align="center">{course.code}</TableCell>
                <TableCell align="center">{course.name}</TableCell>
                <TableCell align="center">{course.department?.name?.short}</TableCell>
                <TableCell align="center">{course.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
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

      {/* ================= PAGINATION ================= */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
      </Box>

      {/* ================= COURSE DETAILS BOX ================= */}


            {selectedCourseDetails &&  
            <DetailsViewBox
            title="Course Details"
            data={{
              "Code": selectedCourseDetails.code,
              'Name': selectedCourseDetails.name,
              'Department': selectedCourseDetails.department?.name?.long || 'N/A',
              'Active': selectedCourseDetails.isActive ? 'Yes' : 'No' 
            }}
            createdAt={new Date(selectedCourseDetails.createdAt_timestamp).toLocaleString()}
            updatedAt={new Date(selectedCourseDetails.updatedAt_timestamp).toLocaleString()}
          />}

      {/* ================= CREATE COURSE DIALOG ================= */}
      <Dialog open={openCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
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

      {/* ================= EDIT COURSE DIALOG ================= */}
      <Dialog open={openEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent dividers>
          {selectedCourse && (
            <>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
                  <Typography fontWeight="bold">Code</Typography>
                  <TextField
                    fullWidth
                    value={selectedCourse.code}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, code: e.target.value.toUpperCase() })}
                  />
                </Box>
                <Box flex="1">
                  <Typography fontWeight="bold">Course Name</Typography>
                  <TextField
                    fullWidth
                    value={selectedCourse.name}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
                  />
                </Box>
              </Box>
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
          <Button color="error" onClick={() => setOpenConfirmDelete(true)}>Delete</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
          <Button onClick={() => setOpenEdit(false)}>Close</Button>
        </DialogActions>
      </Dialog>
           <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        confirmText={selectedCourse?.code}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete Course"
        confirmLabel="Delete Course"
      />
      

       <LogBox logs={logs} />

    </MainCard>

    
  );
}
