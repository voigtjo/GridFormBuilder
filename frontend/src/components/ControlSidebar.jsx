// src/components/ControlSidebar.jsx
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import CodeIcon from '@mui/icons-material/Code';
import InputIcon from '@mui/icons-material/Input'; // new

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
    </Box>
  );
};

export default ControlSidebar;
