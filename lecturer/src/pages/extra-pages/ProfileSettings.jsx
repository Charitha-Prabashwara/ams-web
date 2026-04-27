// material-ui
import { Box, Typography, TextField, Button, Paper, Divider, CircularProgress, Alert, Grid } from '@mui/material';
import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

import MainCard from 'components/MainCard';
import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import { showToast } from '../../utils/toast';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';

// Helper to decode JWT token
const getCurrentLecturerId = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || payload.userId || payload.sub || payload.lecturerId || payload.lecturer_id;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
};

export default function ProfileSettings() {
  const currentLecturerId = getCurrentLecturerId();

  // ---------- FETCH LECTURERS ----------
  const { data: lecturersData, error: lecturersError, mutate: mutateLecturer } = useSWR(['/admin/find/', { type: 'lecturer' }], fetcher);
  const lecturers = lecturersData?.data?.users || [];

  // Current lecturer details
  const currentLecturer = useMemo(() => {
    if (!currentLecturerId) return null;
    return lecturers.find(l => l.id === currentLecturerId || l._id === currentLecturerId) || null;
  }, [lecturers, currentLecturerId]);

  // ---------- STATE ----------
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Populate email when lecturer data loads
  useEffect(() => {
    if (currentLecturer) {
      setEmail(currentLecturer.email || '');
    }
  }, [currentLecturer]);

  // ---------- HANDLERS ----------
  const handleEmailUpdate = async () => {
    if (!email) {
      showToast({ text: 'Email cannot be empty', type: 'error' });
      return;
    }
    setLoadingEmail(true);
    setMessage({ type: '', text: '' });
    try {
      await axiosClient.put('/admin/id/', {
        id: currentLecturerId,
        email: email,
        type: 'lecturer'
      });
      showToast({ text: 'Email updated successfully', type: 'success' });
      mutateLecturer();
    } catch (err) {
      console.error('Update email error:', err);
      const msg = err.response?.data?.message || 'Failed to update email';
      showToast({ text: msg, type: 'error' });
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handlePasswordChange = async () => {
    setMessage({ type: '', text: '' });
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({ text: 'All password fields are required', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      showToast({ text: 'Password should be at least 6 characters', type: 'error' });
      return;
    }
    setLoadingPassword(true);
    try {
      // Assuming endpoint for password change
      await axiosClient.post('/lecturer/change-password', {
        currentPassword,
        newPassword
      });
      showToast({ text: 'Password changed successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Change password error:', err);
      const msg = err.response?.data?.message || 'Failed to change password';
      showToast({ text: msg, type: 'error' });
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoadingPassword(false);
    }
  };

  // Loading and error states
  if (lecturersError) {
    return <LoadingErrorWrapper isLoading={false} isError />;
  }
  if (!lecturersData) {
    return <LoadingErrorWrapper isLoading isError={false} />;
  }

  // If lecturer data not yet loaded, show loading? currentLecturer might be null initially if filtered. Wait for lecturers to load.
  if (!currentLecturer) {
    return <LoadingErrorWrapper isLoading isError={false} />;
  }

  return (
    <MainCard title="Profile & Settings">
      {message.text && (
        <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Profile Details Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <UserOutlined style={{ fontSize: 24, color: '#666' }} />
          <Typography variant="h6">Profile Details</Typography>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
          <Box>
            <TextField
              label="Full Name"
              value={currentLecturer?.name?.full_name || ''}
              fullWidth
              disabled
            />
          </Box>
          <Box>
            <TextField
              label="Registration ID"
              value={currentLecturer?.registration_id || ''}
              fullWidth
              disabled
            />
          </Box>
          <Box>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <TextField
              label="Department"
              value={currentLecturer?.department?.[0] ? `${currentLecturer.department[0].name?.long || ''}` : 'N/A'}
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEmailUpdate}
            disabled={loadingEmail}
          >
            {loadingEmail ? <CircularProgress size={24} /> : 'Update Email'}
          </Button>
        </Box>
      </Paper>

      {/* Change Password Section */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <LockOutlined style={{ fontSize: 24, color: '#666' }} />
          <Typography variant="h6">Change Password</Typography>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
          <Box>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
            />
          </Box>
          <Box /> {/* empty for layout */}
          <Box>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordChange}
            disabled={loadingPassword}
          >
            {loadingPassword ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>
    </MainCard>
  );
}
