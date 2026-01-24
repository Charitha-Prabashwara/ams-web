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
import { courseHelp } from '../../utils/helpDrawerContents';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import DetailsViewBox from '../../components/DetailsViewBox';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import EditCourseDialog from '../../components/EditCourseDialog';
import CreateCourseDialog from '../../components/CreateCourseDialog';

export default function CoursePage() {
  const { data, isLoading, error, mutate } = useSWR('/course/find/', fetcher);
  const { data: deptData } = useSWR('/department/find/', fetcher);

  const courses = data?.courses || [];
  const departments = deptData?.departments || [];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // ---------------- CREATE ----------------
  const [openCreate, setOpenCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', department: '' });

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
        type: 'success'
      });
    } catch (e) {
      showToast({
        text: e.response?.data?.message || 'Error creating course',
        type: 'error'
      });
    }
  };

  // ---------------- HELP DRAWER ----------------
  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp((prev) => !prev);

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
        type: 'success'
      });
    } catch {
      showToast({
        text: e.response?.data?.message || 'Error creating course',
        type: 'error'
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

  if (error) return <LoadingErrorWrapper isLoading={false} isError={true} />;
  if (isLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />;

  return (
    <MainCard title="Courses">
      <UniversalActionBar
        buttons={[
          { label: 'Recover', color: 'error', onClick: () => console.log('Recover clicked') },
          { label: 'New Course', color: 'success', onClick: setOpenCreate },
          { label: 'Open Help', type: 'help' } // automatically handles drawer
        ]}
        helpDrawer={{
          sections: courseHelp,
          title: 'Course Guidelines'
        }}
      />
      {/* ================= TABLE ================= */}
      <UniversalTable
        data={paginated}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowClick={(course) => setSelectedCourseDetails(course)}
        columns={[
          { label: 'Code', key: 'code', align: 'left' },
          { label: 'Name', key: 'name', align: 'left' },
          { label: 'Department', key: 'department', align: 'left', render: (row) => row.department?.name?.short || 'N/A' },
          { label: 'Active', key: 'isActive', align: 'left', render: (row) => (row.isActive ? 'Yes' : 'No') }
        ]}
        renderActions={(course) => (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click
              setSelectedCourse(course);
              setOpenEdit(true);
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

      {/* ================= COURSE DETAILS BOX ================= */}

      {selectedCourseDetails && (
        <DetailsViewBox
          title="Course Details"
          data={{
            Code: selectedCourseDetails.code,
            Name: selectedCourseDetails.name,
            Department: selectedCourseDetails.department?.name?.long || 'N/A',
            Active: selectedCourseDetails.isActive ? 'Yes' : 'No'
          }}
          createdAt={new Date(selectedCourseDetails.createdAt_timestamp).toLocaleString()}
          updatedAt={new Date(selectedCourseDetails.updatedAt_timestamp).toLocaleString()}
        />
      )}

      {/* ================= CREATE COURSE DIALOG ================= */}
      <CreateCourseDialog
  open={openCreate}
  onClose={() => setOpenCreate(false)}
  onSave={handleCreate}
  course={newCourse}
  setCourse={setNewCourse}
  departments={departments}
/>

      {/* ================= EDIT COURSE DIALOG ================= */}

      <EditCourseDialog
  open={openEdit}
  onClose={() => setOpenEdit(false)}
  onSave={handleUpdate}
  onDelete={() => setOpenConfirmDelete(true)}
  course={selectedCourse}
  setCourse={setSelectedCourse}
  departments={departments}
/>


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

      {/* <LogBox logs={logs} /> */}
    </MainCard>
  );
}
