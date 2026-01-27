// material-ui
import { Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import { showToast } from '../../utils/toast';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import DetailsViewBox from '../../components/DetailsViewBox';
import UniversalTable from '../../components/UniversalTable';
import UniversalActionBar from '../../components/UniversalActionBar';
import CreateUserDialog from '../../components/CreateUserDialog';
import EditUserDialog from '../../components/EditUserDialog';

export default function LecturerPage() {
  // ---------- FETCH DEPARTMENTS ----------
  const { data: deptData, error: deptError } = useSWR('/department/find/', fetcher);
  const departments = deptData?.departments || [];
 
  
  // ---------- FETCH USERS ----------
  const { data: usersData, error: usersError, mutate } =
    useSWR(['/admin/find/', { type: 'student' }], fetcher);
   
  // ---------- MAP HODS ----------
  const hods =
    usersData?.data?.users|| [];

    const [openCreate, setOpenCreate] = useState(false);

    const [newHOD, setNewHOD] = useState({
      registrationId: '',
      firstName: '',
      lastName: '',
      fullName: '',
      nameWithInitial: '',
      email: '',
      addressLine1: '',
      addressZip: '',
      departmentId: '',
      password: '',
      confirmPassword: ''
    });
  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginated = hods.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ---------- EDIT ----------
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState(null);

  // ---------- DELETE ----------
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const handleUpdate = async () => {
    try {
     
      
      const data = {
        id: selectedHOD.id,
        registrationId: selectedHOD.registration_id,
        firstName: selectedHOD.name.first_name,
        lastName: selectedHOD.name.last_name,
        fullName: selectedHOD.name.full_name,
        nameWithInitial: selectedHOD.name.with_initial_name,
        addressLine1: selectedHOD.address.line1,
        email: selectedHOD.email,
        addressZip: selectedHOD.address.zip,
        departmentId:selectedHOD.departmentId,
        status: selectedHOD.enable_state,


        type:'department'
      }
      
      await axiosClient.put('/admin/id/', data);
      showToast({ text: 'HOD updated successfully', type: 'success' });
      mutate();
      setOpenEdit(false);
    } catch (err) {
      console.log(err)
      showToast({ text: 'Failed to update HOD', type: 'error' });
    }
  };

  const handleDelete = async () => {
    const delete_data = { id: selectedHOD.id, type:"lecturer"}
    console.log(delete_data);
    
    try {
      await axiosClient.delete('/admin/id/', delete_data);
      mutate();
      setOpenConfirmDelete(false);
      setOpenEdit(false);
    } catch (err) {
      console.log(err)
      showToast({ text: err.message, type: 'error' });
    }
  };

   const handleCreate = async () => {
  try {
  const payload = {
  registrationId: newHOD.registrationId,
  firstName: newHOD.firstName,
  lastName: newHOD.lastName,
  fullName: newHOD.fullName,
  nameWithInitial: newHOD.nameWithInitial,
  email: newHOD.email,
  addressLine1: newHOD.addressLine1,
  addressZip: newHOD.addressZip,
  departmentId: newHOD.departmentId,
  password: newHOD.password,
  confirmPassword: newHOD.confirmPassword,
  type: 'student'
  };
  
  
  await axiosClient.post('/admin/', payload);
  
  
  showToast({ text: 'HOD created successfully', type: 'success' });
  mutate(); // refresh table
  
  
  setOpenCreate(false);
  setNewHOD({
      registrationId: '',
      firstName: '',
      lastName: '',
      fullName: '',
      nameWithInitial: '',
      email: '',
      addressLine1: '',
      addressZip: '',
      departmentId: '',
      password: '',
      confirmPassword: ''
  });
  } catch (err) {
  console.error(err);
  showToast({ text: err.response.data.message || err.message, type: 'error' });
  }
  };

  if (deptError || usersError)
    return <LoadingErrorWrapper isLoading={false} isError />;

  if (!deptData || !usersData)
    return <LoadingErrorWrapper isLoading isError={false} />;

  return (
    <MainCard title="Head of Departments">
      <UniversalActionBar
        buttons={[
          { label: 'New HOD', color: 'success', onClick: () => {} }
        ]}
      />

      <UniversalTable
        data={paginated}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        columns={[
          { label: 'Reg ID', render: r => r.registration_id },
          { label: 'Full Name', render: r => r?.name?.full_name },
          { label: 'Email', render: r => r.email },
          { label: 'Department', render: r => departments.find(d=>d.id === r.department[0])?.name?.long || 'none' }
        ]}
        renderActions={(hod) => (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHOD({
                ...hod,
                departmentId: hod.departmentId || ''
              });
              setOpenEdit(true);
            }}
          >
            Manage
          </Button>
        )}
      />

            <CreateUserDialog
      open={openCreate}
      onClose={() => setOpenCreate(false)}
      onCreate={handleCreate}
      newHOD={newHOD}
      setNewHOD={setNewHOD}
      departments={departments}
      />

      <EditUserDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdate}
        onDelete={() => setOpenConfirmDelete(true)}
        hod={selectedHOD}
        setHOD={setSelectedHOD}
        departments={departments}
      />

      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        confirmText={selectedHOD?.registration_id}
        inputValue={deleteText}
        onInputChange={setDeleteText}
        title="Confirm Delete HOD"
      />
    </MainCard>
  );
}