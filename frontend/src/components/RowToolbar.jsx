// src/components/RowToolbar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, IconButton, TextField, Typography, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const RowToolbar = ({ rows, setRows, selectedRowId }) => {
  const [numCells, setNumCells] = useState(1);
  const [distribution, setDistribution] = useState('1');
  const [rowHeight, setRowHeight] = useState(80);

  useEffect(() => {
    const selectedRow = rows.find((r) => r.id === selectedRowId);
    if (selectedRow) {
      setRowHeight(selectedRow.height || 80);
      setNumCells(selectedRow.cells.length);
      setDistribution(selectedRow.cells.map(c => c.widthRatio).join(':'));
    }
  }, [selectedRowId, rows]);

  const updateSelectedRow = () => {
    const selectedIndex = rows.findIndex((r) => r.id === selectedRowId);
    if (selectedIndex === -1) return;

    const oldRow = rows[selectedIndex];

    const ratioArray = distribution
      .split(':')
      .map((r) => parseInt(r, 10))
      .filter((n) => !isNaN(n) && n > 0);

    const newCells = ratioArray.map((widthRatio, i) => {
      const oldCell = oldRow.cells[i];
      return {
        id: oldCell?.id || `${selectedRowId}-cell-${i}`,
        widthRatio,
        control: oldCell?.control || null
      };
    });

    const updatedRow = {
      ...oldRow,
      height: rowHeight,
      cells: newCells
    };

    const updatedRows = [...rows];
    updatedRows[selectedIndex] = updatedRow;
    setRows(updatedRows);
  };

  const handleAddCell = () => {
    const parts = distribution.split(':').map((n) => parseInt(n, 10));
    parts.push(1);
    setDistribution(parts.join(':'));
    setNumCells(parts.length);
  };

  const handleRowHeightChange = (delta) => {
    setRowHeight((prev) => Math.max(40, prev + delta));
  };

  const handleAddRowBelow = () => {
    const selectedIndex = rows.findIndex((r) => r.id === selectedRowId);
    if (selectedIndex === -1) return;

    const newRowId = `row-${Date.now()}`;
    const defaultCell = {
      id: `${newRowId}-cell-0`,
      widthRatio: 1,
      control: null
    };

    const newRow = {
      id: newRowId,
      height: 80,
      cells: [defaultCell]
    };

    const updatedRows = [...rows];
    updatedRows.splice(selectedIndex + 1, 0, newRow);
    setRows(updatedRows);
  };

  const handleMoveRow = (direction) => {
    const index = rows.findIndex((r) => r.id === selectedRowId);
    if (index < 0) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rows.length) return;

    const newRows = [...rows];
    const [movedRow] = newRows.splice(index, 1);
    newRows.splice(newIndex, 0, movedRow);
    setRows(newRows);
  };

  const handleDeleteRow = () => {
    const updatedRows = rows.filter((row) => row.id !== selectedRowId);
    setRows(updatedRows);
  };

  if (!selectedRowId) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} p={1} bgcolor="#f9f9f9" borderBottom="1px dashed #ccc">
      <Typography variant="subtitle1">Row Configuration</Typography>

      {/* 1 - Add new cell */}
      <IconButton onClick={handleAddCell} color="primary" title="Add Cell">
        <AddIcon />
      </IconButton>

      {/* 2 - Number of cells */}
      <TextField
        label="# Cells"
        type="number"
        value={numCells}
        onChange={(e) => setNumCells(parseInt(e.target.value))}
        size="small"
        sx={{ width: 80 }}
      />

      {/* 3 - Distribution */}
      <TextField
        label="Distribution"
        value={distribution}
        onChange={(e) => setDistribution(e.target.value)}
        size="small"
        sx={{ width: 150 }}
      />

      {/* 4 - Row height controls */}
      <Typography>Height:</Typography>
      <IconButton onClick={() => handleRowHeightChange(-10)}><RemoveIcon /></IconButton>
      <Typography>{rowHeight}px</Typography>
      <IconButton onClick={() => handleRowHeightChange(10)}><AddIcon /></IconButton>

      {/* 5 - Apply */}
      <Button variant="outlined" onClick={updateSelectedRow}>Apply</Button>

      {/* 6-9 - Immediate action buttons */}
      <IconButton onClick={handleAddRowBelow} title="Add Row Below" color="primary">
        <AddCircleOutlineIcon />
      </IconButton>

      <IconButton onClick={() => handleMoveRow('up')} title="Move Row Up">
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton onClick={() => handleMoveRow('down')} title="Move Row Down">
        <ArrowDownwardIcon />
      </IconButton>

      <IconButton
        onClick={handleDeleteRow}
        color="error"
        title="Delete Row"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default RowToolbar;
