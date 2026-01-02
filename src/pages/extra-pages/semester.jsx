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
import {semesterHelp} from '../../utils/helpDrawerContents';
import HelpDrawer from '../../components/HelpDrawer';
import LogBox from '../../components/LogBox';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import DetailsViewBox from '../../components/DetailsViewBox';
import UniversalTable from '../../components/UniversalTable';
export default function SemesterPage() {
  
  const DEPARTMENTS = [
    { id: 'CSE', name: 'Computer Science & Engineering' },
    { id: 'IT', name: 'Information Technology' },
    { id: 'ECE', name: 'Electronics Engineering' }
  ];

  const COURSES = [
    { id: 'SE', name: 'Software Engineering' },
    { id: 'CS', name: 'Computer Science' },
    { id: 'AI', name: 'Artificial Intelligence' }
  ];

  const BATCHES = [
    { id: '2023', name: 'Batch 2023' },
    { id: '2024', name: 'Batch 2024' },
    { id: '2025', name: 'Batch 2025' }
  ];

const { data: semester, error: semError, isLoading: semLoading, mutate: mutateSemesters } =
  useSWR('/semester/find/', fetcher, { refreshInterval: 10000 });

const { data: department, error: deptError, isLoading: deptLoading , mutate: mutateDepartments} =
  useSWR('/department/find/', fetcher);

const { data: batch, error: batchError, isLoading: batchLoading , mutate: mutateBatch} =
  useSWR('/batch/find', fetcher);

  const semesters = semester?.semesters || [];
  const departments = department?.departments || [];
  const batches = batch?.batches ||[]

  const [courses, setCourses] = useState()
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const [isLoadingCourses, setIsLoadingCourses] = useState()
 
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
    setSelectedSemester(semester);
    setOpenEditDialog(true);
  };

      const [openHelp, setOpenHelp] = useState(false);
    const toggleHelp = () => setOpenHelp(prev => !prev)
  const handleSaveEdit = async () => {
    try {
      delete selectedSemester.updatedAt_timestamp;
      await axiosClient.put('/semester/id/', selectedSemester);
            mutateSemesters();
          mutateDepartments();
          mutateBatch();
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


  const loadCourses = (id)=>{
      setIsLoadingCourses(true)
       axiosClient.post('/course/find/',{department: id})
      .then((courses)=>{
        console.log(courses?.data.courses)
      setCourses(courses?.data.courses)
      setIsLoadingCourses(false)
    }).finally(()=>{
      setIsLoadingCourses(false)
    });
    
  }

  useEffect(() => {

  
}, [newSemester]);

  // if (semError || deptError) return <div>Error loading semesters</div>;
  // if (semLoading || deptLoading) return <div>Loading...</div>;

  if (semError || deptError) return <LoadingErrorWrapper isLoading={false} isError={true} />
  if (semLoading || deptLoading) return <LoadingErrorWrapper isLoading={true} isError={false} />


  

  return (
    <MainCard title="Semesters">
      <Box display="flex" justifyContent="flex-end" mb={2} flexWrap="wrap" gap={1}>
        <Button variant="contained" color="error" onClick={null}>Recover</Button>
        <Button variant="contained" color="success" onClick={handleOpenCreateDialog}>
          New Semester
        </Button>
        <Button variant="contained"
         onClick={() => {
          mutateSemesters();
          mutateDepartments();
          mutateBatch(); // ← function call
          toggleHelp();        // ← function call
          }}>Open Help</Button>
        <HelpDrawer open={openHelp} onClose={toggleHelp} sections={semesterHelp} title="Semester Guidelines" />
      </Box>

      {/* ====================== TABLE ===================== */}
<UniversalTable
  data={paginatedSemesters}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={setPage}
  onRowClick={(sem) => setSelectedSemester(sem)}
  columns={[
    { label: 'Code', key: 'code', align: 'center' },
    { label: 'Name', key: 'name', align: 'center' },
    {
      label: 'Department',
      key: 'department',
      align: 'center',
      render: (row) => row.department?.name?.short || '-'
    },
    {
      label: 'Course',
      key: 'course',
      align: 'center',
      render: (row) => row.course?.name || '-'
    },
    {
      label: 'Batch',
      key: 'batch',
      align: 'center',
      render: (row) => row.batch?.name || '-'
    }
  ]}
  actionsColumn={{
    render: (row) => (
      <Button
        size="small"
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation(); // prevent row click
          handleOpenEditDialog(row);
        }}
      >
        Edit / Delete
      </Button>
    )
  }}
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
      <Dialog open={openEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Semester</DialogTitle>

        <DialogContent dividers>
          {selectedSemester && (
            <>
              {/* ================= ROW 1: CODE + NAME ================= */}
              <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                {/* CODE */}
                <Box flex={{ xs: '1 1 100%', sm: '0 0 120px' }}>
                  <Typography fontWeight="bold">Code</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.code}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, code: e.target.value })}
                  />
                </Box>

                {/* NAME */}
                <Box flex={{ xs: '1 1 100%', sm: '1' }}>
                  <Typography fontWeight="bold">Name</Typography>
                  <TextField
                    fullWidth
                    value={selectedSemester.name}
                    onChange={(e) => setSelectedSemester({ ...selectedSemester, name: e.target.value })}
                  />
                </Box>
              </Box>

              {/* ================= ROW 2: DEPARTMENT / COURSE / BATCH ================= */}
              <Box display="flex" flexWrap="wrap" gap={2}>
                {/* DEPARTMENT */}
                <Box flex={{ xs: '1 1 100%', sm: '1' }}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={selectedSemester.department}
                      label="Department"
                      onChange={(e) => setSelectedSemester({ ...selectedSemester, department: e.target.value })}
                    >
                      {DEPARTMENTS.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* COURSE */}
                <Box flex={{ xs: '1 1 100%', sm: '1' }}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={selectedSemester.course}
                      label="Course"
                      onChange={(e) => setSelectedSemester({ ...selectedSemester, course: e.target.value })}
                    >
                      {COURSES.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* BATCH */}
                <Box flex={{ xs: '1 1 100%', sm: '1' }}>
                  <FormControl fullWidth>
                    <InputLabel>Batch</InputLabel>
                    <Select
                      value={selectedSemester.batch}
                      label="Batch"
                      onChange={(e) => setSelectedSemester({ ...selectedSemester, batch: e.target.value })}
                    >
                      {BATCHES.map((b) => (
                        <MenuItem key={b.id} value={b.id}>
                          {b.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
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
                    {selectedSemester &&  
                        <DetailsViewBox
                        title="Semester Details"
                        data={{
                          "Code": selectedSemester.code,
                          'Name': selectedSemester.name,
                          'Department': selectedSemester.department?.name?.short || "N/A",
                          'Course': selectedSemester.course?.name || "N/A",
                          'Batch': selectedSemester.batch?.name || "N/A"
                        }}
                        createdAt={new Date(selectedSemester.createdAt_timestamp).toLocaleString()}
                        updatedAt={new Date(selectedSemester.updatedAt_timestamp).toLocaleString()}
                      />}
            

             <LogBox logs={logs} />
    </MainCard>

           

  );
}
