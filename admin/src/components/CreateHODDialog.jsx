import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

export default function CreateHODDialog({
  open,
  onClose,
  onCreate,
  newHOD,
  setNewHOD,
  departments = []
}) {
  const handleInputChange = (field, value) => {
    setNewHOD((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate full name & initials
      if (field === 'firstName' || field === 'lastName') {
        const firstName = field === 'firstName' ? value : prev.firstName;
        const lastName = field === 'lastName' ? value : prev.lastName;
        updated.fullName = `${firstName} ${lastName}`.trim().toUpperCase();
        updated.nameWithInitial =
          firstName && lastName
            ? `${firstName[0].toUpperCase()}. ${lastName.toUpperCase()}`
            : '';
      }

      return updated;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Department Head</DialogTitle>

      <DialogContent>
        <Box mt={2}>

          {/* ===== IDENTITY INFORMATION ===== */}
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Identity Information
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '120px 1fr 1fr' }} gap={2}>
            <TextField
              label="Registration ID"
              value={newHOD.registrationId}
              onChange={(e) => handleInputChange('registrationId', e.target.value)}
              inputProps={{ maxLength: 10 }}
              fullWidth
            />
            <TextField
              label="First Name"
              value={newHOD.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={newHOD.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              fullWidth
            />
          </Box>

          {/* ===== CONTACT INFORMATION ===== */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom mt={3}>
            Contact Information
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 3fr 100px' }} gap={2}>
            <TextField
              label="Email"
              value={newHOD.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
            />
            <TextField
              label="Address Line 1"
              value={newHOD.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              fullWidth
            />
            <TextField
              label="ZIP Code"
              value={newHOD.addressZip}
              onChange={(e) => handleInputChange('addressZip', e.target.value)}
              inputProps={{ maxLength: 6 }}
              fullWidth
            />
          </Box>

          {/* ===== DEPARTMENT ASSIGNMENT ===== */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom mt={3}>
            Academic Assignment
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={newHOD.departmentId}
                label="Department"
                onChange={(e) => handleInputChange('departmentId', e.target.value)}
                fullWidth
              >
                {departments.map((dept, idx) => (
                  <MenuItem key={idx} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* ===== SECURITY CREDENTIALS ===== */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom mt={3}>
            Security Credentials
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <TextField
              label="Password"
              type="password"
              value={newHOD.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={newHOD.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}