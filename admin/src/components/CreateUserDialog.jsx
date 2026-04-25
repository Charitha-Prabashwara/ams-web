import { React, useState } from 'react';

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
import AlphaUpperTextField from './AlphaUpperTextField';

export default function CreateUserDialog({ open, onClose, onCreate, newHOD, setNewHOD, departments = [] }) {
  const handleChange = (field, value) => {
    setNewHOD((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate full name & initials

      return updated;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Department Head</DialogTitle>

      <DialogContent>
        <Box mt={2}>
          {/* ===== IDENTITY ===== */}
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Identity Information
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '120px 1fr 1fr' }} gap={2}>
            <AlphaUpperTextField
              label="Registration ID"
              value={newHOD.registrationId}
              onChange={(val) => handleChange('registrationId', val)}
              allowSpace={false}
              forceUppercase={true}
              allowedRegex={/[^A-Z0-9/]/g}
              fullWidth
            />

            <AlphaUpperTextField
              label="First Name"
              value={newHOD.firstName}
              onChange={(val) => handleChange('firstName', val)}
              forceUppercase={true}
              fullWidth
            />

            <AlphaUpperTextField
              label="Last Name"
              value={newHOD.lastName}
              onChange={(val) => handleChange('lastName', val)}
              forceUppercase={true}
              fullWidth
            />
          </Box>

          {/* Full Name & Initials */}
          <Box mt={2} display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <AlphaUpperTextField
              label="Full Name"
              value={newHOD.fullName}
              onChange={(val) => handleChange('fullName', val)}
              forceUppercase={true}
              allowedRegex={/[^a-zA-Z ]/g}
              fullWidth
            />

            <AlphaUpperTextField
              label="Initials"
              value={newHOD.nameWithInitial}
              onChange={(val) => handleChange('nameWithInitial', val)}
              forceUppercase={true}
              allowedRegex={/[^a-zA-Z .]/g}
              fullWidth
            />
          </Box>

          {/* ===== CONTACT ===== */}
          <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
            Contact Information
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 3fr 100px' }} gap={2}>
            <TextField label="Email" type="email" value={newHOD.email} onChange={(e) => handleChange('email', e.target.value)} fullWidth />
            <TextField
              label="Address Line 1"
              value={newHOD.addressLine1}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
              fullWidth
            />
            {/* <TextField
              label="ZIP Code"
              value={newHOD.addressZip}
              onChange={(val) => handleChange('addressZip', e.target.value)}
              
              fullWidth
            /> */}

            <AlphaUpperTextField
              label="ZIP Code"
              value={newHOD.addressZip}
              onChange={(val) => handleChange('addressZip', val)}
              forceUppercase={false}
              allowedRegex={/[^0-9]/g}
              fullWidth
            />
          </Box>

          {/* ===== DEPARTMENT ===== */}
          <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
            Academic Assignment
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select label="Department" value={newHOD.departmentId || ''} onChange={(e) => handleChange('departmentId', e.target.value)}>
              {departments.map((dept) => (
                <MenuItem key={dept.id || dept._id} value={dept.id || dept._id}>
                  {dept.name?.long || dept.name?.short}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ===== SECURITY ===== */}
          <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
            Security Credentials
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <TextField
              label="Password"
              type="password"
              value={newHOD.password}
              onChange={(e) => handleChange('password', e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={newHOD.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
