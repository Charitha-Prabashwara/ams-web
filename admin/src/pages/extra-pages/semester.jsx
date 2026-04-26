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
  Fade,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import CreateSemesterDialog from '../../components/CreateSemestreDialog';
import ConfirmCreateDialog from '../../components/ConfirmCreateDialog';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import { semesterHelp } from '../../utils/helpDrawerContents';
import HelpDrawer from '../../components/HelpDrawer';
import LogBox from '../../components/LogBox';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import DetailsViewBox from '../../components/DetailsViewBox';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import SemesterEditDialog from '../../components/SemesterEditDialog';
import { showToast } from '../../utils/toast';
export default function SemesterPage() {
  const {
    data: semester,
    error: semError,
    isLoading: semLoading,
    mutate: mutateSemesters
  } = useSWR('/semester/find/', fetcher, { refreshInterval: 10000 });

  const { data: department, error: deptError, isLoading: deptLoading, mutate: mutateDepartments } = useSWR('/department/find/', fetcher);

  const { data: batch, error: batchError, isLoading: batchLoading, mutate: mutateBatch } = useSWR('/batch/find', fetcher);

  const semesters = semester?.semesters || [];
  const departments = department?.departments || [];
  const batches = batch?.batches || [];

  const [courses, setCourses] = useState();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const [isLoadingCourses, setIsLoadingCourses] = useState();
  const [courseError, setCourseError] = useState(null);

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
      mutateSemesters();
      mutateDepartments();
      mutateBatch();
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
    setSelectedSemester({
      ...semester,
      department: semester.department?.id ?? semester.department,
      course: semester.course?.id ?? semester.course,
      batch: semester.batch?.id ?? semester.batch
    });
    setOpenEditDialog(true);
  };

  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp((prev) => !prev);
  const handleSaveEdit = async () => {
    try {
      delete selectedSemester.updatedAt_timestamp;
      delete selectedSemester.createdAt_timestamp;

      const updateSemObj = {
        id: selectedSemester.id,
        code: selectedSemester.code,
        name: selectedSemester.code,
        department: selectedSemester.department._id,
        course: selectedSemester.course._id,
        batch: selectedSemester.batch._id
      };
      const response = await axiosClient.put('/semester/id/', updateSemObj);
      mutateSemesters();
      mutateDepartments();
      mutateBatch();
      setOpenEditDialog(false);
      showToast({
        text: response.data.message || 'Semester updated successfully',
        type: 'success'
      });
    } catch (err) {
      showToast({
        text: err.response?.data?.message || 'Error Update Semester',
        type: 'error'
      });
    }
  };

  const handleFinalDelete = async () => {
    if (deleteText !== selectedSemester.name) {
      alert('Type correct semester name to delete!');
      return;
    }
    try {
      await axiosClient.delete('/semester/id/', { data: { id: selectedSemester.id } });
      mutateSemesters();
      mutateDepartments();
      mutateBatch();
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

  const [logs, setLogs] = useState([
    '[12:00:00] Department IT created successfully.',
    '[12:05:12] Department CS updated.',
    '[12:15:33] Error: Failed to delete department.'
  ]);

  const loadCourses = (id) => {
    setIsLoadingCourses(true);
    setCourseError(null);
    axiosClient
      .post('/course/find/', { department: id })
      .then((courses) => {
        setCourses(courses?.data.courses);
      })
      .catch((error) => {
        setCourseError(error);
      })
      .finally(() => {
        setIsLoadingCourses(false);
      });
  };

  const handleReload = (semester = newSemester) => {
    // Reload courses for the specified semester's department
    const departmentId = semester?.department?.id || semester?.department?._id || semester?.department;
    if (departmentId) {
      loadCourses(departmentId);
    }
  };

  useEffect(() => {}, [newSemester]);

  // if (semError || deptError) return <div>Error loading semesters</div>;
  // if (semLoading || deptLoading) return <div>Loading...</div>;

  if ((semError || deptError || batchError) && !openCreateDialog && !openEditDialog) return <LoadingErrorWrapper isLoading={false} isError={true} />;
  if ((semLoading || deptLoading || batchLoading) && !openCreateDialog && !openEditDialog) return <LoadingErrorWrapper isLoading={true} isError={false} />;

  return (
    <MainCard title="Semesters">
      <UniversalActionBar
        buttons={[
          { label: 'Recover', color: 'error', onClick: () => console.log('Recover clicked') },
          {
            label: 'New Semester',
            color: 'success',
            onClick: () => {
              mutateSemesters();
              mutateDepartments();
              mutateBatch(); // ← function call
              handleOpenCreateDialog();
            }
          },
          { label: 'Open Help', type: 'help' } // automatically handles drawer
        ]}
        helpDrawer={{
          sections: semesterHelp,
          title: 'Semester Guidelines'
        }}
      />

      {/* ====================== TABLE ===================== */}
      <UniversalTable
        data={paginatedSemesters}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowClick={(sem) => setSelectedSemester(sem)}
        columns={[
          { label: 'Code', key: 'code', align: 'left' },
          { label: 'Name', key: 'name', align: 'left' },
          {
            label: 'Department',
            key: 'department',
            align: 'left',
            render: (row) => row.department?.name?.short || '-'
          },
          {
            label: 'Course',
            key: 'course',
            align: 'left',
            render: (row) => row.course?.name || '-'
          },
          {
            label: 'Batch',
            key: 'batch',
            align: 'left',
            render: (row) => row.batch?.name || '-'
          }
        ]}
        renderActions={(semester) => (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click
              mutateDepartments();
              mutateBatch();
              //console.log(typeof(semester.course?._id))
              loadCourses(semester.course?.id);
              handleOpenEditDialog(semester);
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

      <CreateSemesterDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={handleSubmitCreate}
        semester={newSemester}
        setSemester={setNewSemester}
        departments={departments}
        courses={courses}
        batches={batches}
        isLoadingDepartments={deptLoading}
        isLoadingCourses={isLoadingCourses}
        isLoadingBatches={batchLoading}
        onDepartmentChange={loadCourses}
        courseError={courseError}
        onReload={handleReload}
      />

      {/* ====================== CONFIRM CREATE ====================== */}
      <ConfirmCreateDialog
        open={openConfirmCreateDialog}
        onClose={() => setOpenConfirmCreateDialog(false)}
        onConfirm={handleFinalCreate}
        confirmText={newSemester.name}
        inputValue={confirmText}
        onInputChange={setConfirmText}
        title="Confirm Create Semester"
        confirmLabel="Create Semester"
      />

      {/* ====================== EDIT DIALOG ====================== */}
      <SemesterEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        semester={selectedSemester}
        setSemester={setSelectedSemester}
        onSave={handleSaveEdit}
        onDelete={() => setOpenConfirmDelete(true)}
        departments={departments}
        courses={courses}
        batches={batches}
        loading={deptLoading || batchLoading || isLoadingCourses}
        onDepartmentChange={loadCourses}
        courseError={courseError}
        onReload={() => handleReload(selectedSemester)}
      />

      {/* ====================== CONFIRM DELETE ====================== */}

      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleFinalDelete}
        confirmText={selectedSemester?.name}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete Semester"
        confirmLabel="Delete Semester"
      />

      {/* ====================== SELECTED Semester DETAILS ====================== */}
      {selectedSemester && (
        <DetailsViewBox
          title="Semester Details"
          data={{
            Code: selectedSemester.code,
            Name: selectedSemester.name,
            Department: selectedSemester.department?.name?.short || 'N/A',
            Course: selectedSemester.course?.name || 'N/A',
            Batch: selectedSemester.batch?.name || 'N/A'
          }}
          createdAt={new Date(selectedSemester.createdAt_timestamp).toLocaleString()}
          updatedAt={new Date(selectedSemester.updatedAt_timestamp).toLocaleString()}
        />
      )}

      {/* <LogBox logs={logs} /> */}
    </MainCard>
  );
}
