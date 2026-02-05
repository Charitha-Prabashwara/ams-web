import { Box, Typography, Divider } from '@mui/material';

const DetailsViewBox = ({ title = 'Details', data = {}, createdAt, updatedAt }) => {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <Box
      mt={2}
      sx={{
        overflowY: 'auto',
        height: '100%',
        p: 2,
        border: 3,
        borderColor: '#97c5ebff',
        borderRadius: 2,
        bgcolor: '#e5f1faff'
      }}
    >
      <Typography variant="h6" mb={1}>
        {title}
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {/* Dynamic Key-Value Rendering */}
      {Object.entries(data).map(([label, value]) => (
        <Typography key={label} mb={0.5}>
          <strong>{label}:</strong> {value !== null && value !== undefined ? value : 'N/A'}
        </Typography>
      ))}

      {(createdAt || updatedAt) && <Divider sx={{ my: 1 }} />}

      {createdAt && (
        <Typography variant="caption" display="block">
          <strong>Created:</strong> {new Date(createdAt).toLocaleString()}
        </Typography>
      )}

      {updatedAt && (
        <Typography variant="caption" display="block">
          <strong>Updated:</strong> {new Date(updatedAt).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
};

export default DetailsViewBox;
