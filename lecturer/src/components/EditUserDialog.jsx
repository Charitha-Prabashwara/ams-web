import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import AlphaUpperTextField from './AlphaUpperTextField';

export default function EditUserDialog({
  open,
  onClose,
  onSave,
  onDelete,
  hod,
  setHOD,
  departments = []
}) {
  if (!hod) return null;

  /* 🔥 AUTO-NORMALIZE DEPARTMENT ON LOAD */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let deptId = '';

    if (hod.departmentId) {
      deptId = hod.departmentId;
    } else if (Array.isArray(hod.department) && hod.department.length > 0) {
      deptId = hod.department[0]; // ✅ STRING ID
    }

    if (deptId && hod.departmentId !== deptId) {
      setHOD(prev => ({
        ...prev,
        departmentId: deptId
      }));
    }
  }, [hod, setHOD]);

  const handleChange = (field, value) => {
    setHOD(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit / View Department Head</DialogTitle>

      <DialogContent>
        <Box mt={2}>
          {/* ===== IDENTITY ===== */}
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Identity Information
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '120px 1fr 1fr' }} gap={2}>
            <AlphaUpperTextField
              label="Registration ID"
              value={hod.registration_id || ''}
              onChange={(val) => handleChange('registration_id', val)}
              forceUppercase={true}
              allowedRegex={/[^A-Z0-9/]/g}
              fullWidth
            />

            <AlphaUpperTextField
              label="First Name"
              value={hod?.name?.first_name || ''}
              onChange={(val) =>
                handleChange('name', { ...hod.name, first_name: val })
              }
              forceUppercase={true}
              allowedRegex={/[^a-zA-Z ]/g}
              fullWidth
            />

            <AlphaUpperTextField
              label="Last Name"
              value={hod?.name?.last_name || ''}
              onChange={(val) =>
                handleChange('name', { ...hod.name, last_name: val })
              }
              forceUppercase={true}
              allowedRegex={/[^a-zA-Z ]/g}
              fullWidth
            />
          </Box>

          {/* Full Name & Initials */}
          <Box mt={2} display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <AlphaUpperTextField
              label="Full Name"
              value={hod?.name?.full_name || `${hod?.name?.first_name || ''} ${hod?.name?.last_name || ''}`.trim()}
              onChange={(val) =>
                handleChange('name', { ...hod.name, full_name: val })
              }
              forceUppercase={true}
              allowedRegex={/[^a-zA-Z ]/g}
              fullWidth
            />

            <AlphaUpperTextField
              label="Initials"
              value={hod?.name?.with_initial_name || ''}
              onChange={(val) =>
                handleChange('name', { ...hod.name, with_initial_name: val })
              }
              forceUppercase={true}
              allowedRegex={/[^a-zA-Z .]/g} // allow letters, space, and period
              fullWidth
            />
          </Box>

          {/* ===== CONTACT ===== */}
          <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
            Contact Information
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 3fr 100px' }} gap={2}>
            <AlphaUpperTextField
              label="Email"
              value={hod.email || ''}
              onChange={(val) => handleChange('email', val)}
              forceUppercase={false}
              fullWidth
            />

            <AlphaUpperTextField
              label="Address Line 1"
              value={hod?.address?.line1 || ''}
              onChange={(val) =>
                handleChange('address', { ...hod.address, line1: val })
              }
              forceUppercase={false}
              fullWidth
            />

            <AlphaUpperTextField
              label="ZIP Code"
              value={hod?.address?.zip || ''}
              onChange={(val) =>
                handleChange('address', { ...hod.address, zip: val })
              }
              forceUppercase={false}
              allowedRegex={/[^0-9]/g} // only digits allowed
              fullWidth
            />
          </Box>

          {/* ===== DEPARTMENT ===== */}
          <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
            Academic Assignment
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={hod.departmentId || ''}
              onChange={(e) => handleChange('departmentId', e.target.value)}
            >
              {departments.map(dept => (
                <MenuItem key={dept.id || dept._id} value={dept.id || dept._id}>
                  {dept.name?.long || dept.name?.short}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ===== STATUS ===== */}
          <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
            Status
          </Typography>

          <FormControl fullWidth>
            <Select
              value={hod.enable_state ? 'active' : 'inactive'}
              onChange={(e) =>
                handleChange('enable_state', e.target.value === 'active')
              }
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onDelete} color="error">Delete</Button>
        <Button onClick={() => onSave(hod)} variant="contained">Save</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}