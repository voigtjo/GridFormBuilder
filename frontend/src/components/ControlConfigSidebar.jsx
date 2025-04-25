import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel
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

  const handleDropdownOptionChange = (index, key, value) => {
    const newOptions = [...(control.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    updateControl({ options: newOptions });
  };

  const addDropdownOption = () => {
    const newOptions = [...(control.options || []), { label: 'New Option', value: '' }];
    updateControl({ options: newOptions });
  };

  const removeDropdownOption = (index) => {
    const newOptions = control.options.filter((_, i) => i !== index);
    updateControl({ options: newOptions });
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

      {(control.type === 'input' || control.type === 'date' || control.type === 'checkbox') && (
        <TextField
          fullWidth
          label="Label"
          value={control.label || ''}
          onChange={(e) => updateControl({ label: e.target.value })}
          size="small"
          sx={{ mb: 2 }}
        />
      )}

      {control.type === 'input' && (
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
      )}

      {control.type === 'dropdown' && (
        <>
          <TextField
            fullWidth
            label="Dropdown Label"
            value={control.label || ''}
            onChange={(e) => updateControl({ label: e.target.value })}
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" gutterBottom>Options</Typography>
          {(control.options || []).map((opt, index) => (
            <Box key={index} display="flex" gap={1} mb={1}>
              <TextField
                label="Label"
                value={opt.label}
                onChange={(e) => handleDropdownOptionChange(index, 'label', e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Value"
                value={opt.value}
                onChange={(e) => handleDropdownOptionChange(index, 'value', e.target.value)}
                size="small"
                fullWidth
              />
              <IconButton onClick={() => removeDropdownOption(index)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button onClick={addDropdownOption} size="small" variant="outlined">Add Option</Button>
        </>
      )}

      {control.type === 'checkbox' && (
        <FormControlLabel
          control={
            <Checkbox
              checked={control.checked || false}
              onChange={(e) => updateControl({ checked: e.target.checked })}
            />
          }
          label="Default Checked"
          sx={{ mt: 1 }}
        />
      )}

      <FormControl fullWidth size="small" sx={{ mt: 3, mb: 2 }}>
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
