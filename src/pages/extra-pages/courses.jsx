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
  Fade,
  Drawer,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import { showToast } from '../../utils/toast';

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
    const handleToggleHelp = () => setOpenHelp(!openHelp);

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

  // ---------------- PAGINATION ----------------
  const paginated = courses.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(courses.length / rowsPerPage);

  if (error) return <div>Error loading courses</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title="Courses">
      
      <Box display="flex" justifyContent="flex-end" mb={2} flexWrap="wrap" gap={1}>
         <Button variant="contained" color="error" onClick={null}>
                  Recover
                </Button>
        <Button variant="contained" color="success" onClick={() => setOpenCreate(true)}>
          New Course
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
      {selectedCourseDetails && (
        <Box
          mt={2}
          sx={{
            p: 2,
            border: 3,
            borderColor: '#97c5ebff',
            borderRadius: 2,
            bgcolor: '#e5f1faff'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Course Details
          </Typography>

          <Typography><b>Code:</b> {selectedCourseDetails.code}</Typography>
          <Typography><b>Name:</b> {selectedCourseDetails.name}</Typography>
          <Typography>
            <b>Department:</b> {selectedCourseDetails.department?.name?.long || 'N/A'}
          </Typography>
          <Typography>
            <b>Active:</b> {selectedCourseDetails.isActive ? 'Yes' : 'No'}
          </Typography>
          <Typography><b>created :</b> {new Date(selectedCourseDetails.createdAt_timestamp).toLocaleString()}</Typography>
          <Typography><b>updated :</b> {new Date(selectedCourseDetails.updatedAt_timestamp).toLocaleString()}</Typography>
        </Box>
      )}

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

      {/* ================= CONFIRM DELETE DIALOG ================= */}
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
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
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
    <Typography variant="h6">Course Guidelines</Typography>
    <IconButton onClick={handleToggleHelp}>✖</IconButton>
  </Box>

  <Box sx={{ overflowY: 'auto', height: '100%', p: 2 }}>
    {/* Section 1: What is a Course */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      1. What is a Course
    </Typography>
    <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
      A course represents a unit of study offered by a department. Each course has a unique code, a descriptive name, and belongs to a specific department. 
      Courses form the core of the academic curriculum and are essential for students to acquire knowledge and skills in a structured way.
    </Typography>

    {/* Section 2: How to Maintain Courses */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      2. How to Maintain Courses
    </Typography>
    <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
      - Ensure each course has a unique code and a clear, descriptive name.<br/>
      - Assign courses to the correct department to maintain academic organization.<br/>
      - Keep course information up to date, including department, name, and active status.<br/>
      - Use consistent naming conventions to avoid confusion for students and faculty.
    </Typography>

    {/* Section 3: How to Create Courses */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      3. How to Create Courses
    </Typography>
    <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
      - Click the "New Course" button to open the creation dialog.<br/>
      - Enter a unique course code, a descriptive course name, and select the corresponding department.<br/>
      - Confirm that all fields are correctly filled before saving.<br/>
      - After saving, the course will appear in the course list and can be assigned to students.
    </Typography>

    {/* Section 4: How to Update Courses */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      4. How to Update Courses
    </Typography>
    <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
      - Select the course you want to update from the table.<br/>
      - Click "Edit / Delete" to modify the course details.<br/>
      - Update the course code, name, department, or active status as needed.<br/>
      - Save changes to apply updates and ensure consistency in the system.
    </Typography>

    {/* Section 5: How to Delete Courses */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      5. How to Delete Courses
    </Typography>
    <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
      - Only inactive or obsolete courses should be deleted.<br/>
      - Click "Edit / Delete" and then "Delete" to remove a course.<br/>
      - Confirm the course code to prevent accidental deletion.<br/>
      - Deleted courses can be restored by administrators if needed.
    </Typography>

    {/* Section 6: Maintaining System Integrity */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      6. Maintaining System Integrity
    </Typography>
    <Typography variant="body2" mb={2} sx={{ textAlign: 'justify' }}>
      - Ensure course codes are unique to prevent conflicts in student enrollment and reporting.<br/>
      - Avoid using special characters in course codes or names that could affect system logic.<br/>
      - Verify updates before saving or deleting courses to maintain accurate academic records.<br/>
      - Restrict modifications to authorized personnel only.
    </Typography>

    {/* Section 7: Contact Information */}
    <Typography variant="h6" mb={1} fontWeight="bold" sx={{ textAlign: 'justify' }}>
      7. Contact Information
    </Typography>
    <Typography variant="body2" mb={1} sx={{ textAlign: 'justify' }}>
      For any questions or assistance regarding course management, please contact the academic system administrator.
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

    </MainCard>

    
  );
}
