import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Pagination, Box, Button } from '@mui/material';

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

export default function UniversalTable({
  data = [],
  columns = [],
  page = 1,
  rowsPerPage = 5,
  totalPages = 1,
  onPageChange = () => {},
  onRowClick = () => {},
  renderActions = null
}) {
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const renderCellValue = (row, col) => {
    const val = col.render ? col.render(row) : getNestedValue(row, col.key);

    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') return JSON.stringify(val); // fallback for objects
    return val;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 330, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align || 'left'}>
                  {col.label}
                </TableCell>
              ))}
              {renderActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => onRowClick(row)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0f7fa' } }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align || 'left'}>
                    {renderCellValue(row, col)}
                  </TableCell>
                ))}
                {renderActions && <TableCell>{renderActions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={totalPages} page={page} onChange={(e, val) => onPageChange(val)} />
      </Box>
    </>
  );
}
