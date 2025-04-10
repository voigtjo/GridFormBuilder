// src/components/ControlConfigSidebar.jsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ControlConfigSidebar = ({ rows, setRows, selectedCellId, theme }) => {
  if (!selectedCellId) return null;

  const rowIndex = rows.findIndex((r) => r.cells.some((c) => c.id === selectedCellId));
  const cellIndex = rowIndex >= 0 ? rows[rowIndex].cells.findIndex((c) => c.id === selectedCellId) : -1;
  const control = rowIndex >= 0 && cellIndex >= 0 ? rows[rowIndex].cells[cellIndex].control : null;

  const updateControl = (updates) => {
    const updatedRows = rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      return {
        ...row,
        cells: row.cells.map((cell, cIdx) => {
          if (cIdx !== cellIndex) return cell;
          return {
            ...cell,
            control: {
              ...cell.control,
              ...updates,
            }
          };
        })
      };
    });
    setRows(updatedRows);
  };

  const deleteControl = () => {
    const updatedRows = rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      return {
        ...row,
        cells: row.cells.map((cell, cIdx) => {
          if (cIdx !== cellIndex) return cell;
          return {
            ...cell,
            control: null
          };
        })
      };
    });
    setRows(updatedRows);
  };

  if (!control) return null;

  return (
    <Box
      sx={{
        width: 300,
        minWidth: 300,
        p: 2,
        bgcolor: theme?.formBg,
        height: '100vh',
        borderLeft: `1px solid ${theme?.borderColor}`
      }}
    >
      <Typography variant="h6" gutterBottom>Configure Control</Typography>

      {control.type === 'markdown' && (
        <TextField
          fullWidth
          multiline
          minRows={6}
          label="Markdown Content"
          value={control.content || ''}
          onChange={(e) => updateControl({ content: e.target.value })}
          sx={{ mb: 2 }}
        />
      )}

      {control.type === 'input' && (
        <>
          <TextField
            fullWidth
            label="Label"
            value={control.label || ''}
            onChange={(e) => updateControl({ label: e.target.value })}
            size="small"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Input Type</InputLabel>
            <Select
              value={control.inputType || 'text'}
              label="Input Type"
              onChange={(e) => updateControl({ inputType: e.target.value })}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="integer">Integer</MenuItem>
              <MenuItem value="number">Number</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {/* Horizontal Alignment */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Horizontal Align</InputLabel>
        <Select
          value={control.hAlign || 'left'}
          label="Horizontal Align"
          onChange={(e) => updateControl({ hAlign: e.target.value })}
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="right">Right</MenuItem>
          <MenuItem value="stretch">Full Width</MenuItem>
        </Select>
      </FormControl>

      {/* Vertical Alignment */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Vertical Align</InputLabel>
        <Select
          value={control.vAlign || 'top'}
          label="Vertical Align"
          onChange={(e) => updateControl({ vAlign: e.target.value })}
        >
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
        </Select>
      </FormControl>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <IconButton onClick={deleteControl} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ControlConfigSidebar;
