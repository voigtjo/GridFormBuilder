// src/components/CellToolbar.jsx
import React from 'react';
import {
  Box, Typography, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CellToolbar = ({ rows, setRows, selectedCellId }) => {
  if (!selectedCellId) return null;

  const findCellLocation = () => {
    for (const row of rows) {
      for (const cell of row.cells) {
        if (cell.id === selectedCellId) {
          return { rowId: row.id, cellId: cell.id };
        }
      }
    }
    return null;
  };

  const cellInfo = findCellLocation();
  if (!cellInfo) return null;

  const { rowId, cellId } = cellInfo;

  const handleDeleteCell = () => {
    const updatedRows = rows.map((row) => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        cells: row.cells.filter((cell) => cell.id !== cellId)
      };
    });
    setRows(updatedRows);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} p={1} bgcolor="#f5f5f5" borderBottom="1px dashed #ccc">
      <Typography variant="subtitle1">Cell Configuration</Typography>
      <IconButton color="error" onClick={handleDeleteCell} title="Delete Cell">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CellToolbar;
