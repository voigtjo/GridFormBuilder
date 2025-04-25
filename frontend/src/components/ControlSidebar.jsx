import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import InputIcon from '@mui/icons-material/Input';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import EventIcon from '@mui/icons-material/Event';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const ControlSidebar = ({ rows, setRows, selectedCellId, theme }) => {
  const handleAddControl = (type) => {
    if (!selectedCellId) return;

    const newRows = rows.map((row) => ({
      ...row,
      cells: row.cells.map((cell) => {
        if (cell.id === selectedCellId) {
          let control = { type };
          if (type === 'markdown') control.content = '### Markdown text';
          if (type === 'input') control = { ...control, label: 'Input Label', inputType: 'text' };
          if (type === 'dropdown') control = {
            ...control,
            label: 'Select Option',
            options: [
              { label: 'Option A', value: 'a' },
              { label: 'Option B', value: 'b' }
            ]
          };
          if (type === 'date') control = { ...control, label: 'Select Date' };
          if (type === 'checkbox') control = { ...control, label: 'Check me', checked: false };
          return { ...cell, control };
        }
        return cell;
      })
    }));

    setRows(newRows);
  };

  return (
    <Box width={60} p={1} bgcolor={theme?.formBg || '#f5f5f5'} borderRight={`1px solid ${theme?.borderColor || '#ccc'}`}>
      <Tooltip title="Markdown / HTML">
        <IconButton onClick={() => handleAddControl('markdown')}>
          <CodeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Input">
        <IconButton onClick={() => handleAddControl('input')}>
          <InputIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Dropdown">
        <IconButton onClick={() => handleAddControl('dropdown')}>
          <ArrowDropDownCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Date Picker">
        <IconButton onClick={() => handleAddControl('date')}>
          <EventIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Checkbox">
        <IconButton onClick={() => handleAddControl('checkbox')}>
          <CheckBoxIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ControlSidebar;
