import React, { useEffect } from 'react';
import {
  Box, MenuItem, Select, TextField, IconButton, Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { themes } from '../utils/themeOptions';

const FormManagement = ({
  formName,
  setFormName,
  newFormName,
  setNewFormName,
  availableForms,
  onLoadForm,
  onCreateForm,
  onSaveForm,
  theme,
  setTheme,
  currentRows,
  formReady,
  setRows,
  setFormReady,
  clearNewFormNameTrigger,
  onClearNewFormNameHandled,
  hasUnsavedChanges
}) => {
  const [creating, setCreating] = React.useState(false);

  useEffect(() => {
    if (clearNewFormNameTrigger) {
      setNewFormName('');
      setCreating(false);
      onClearNewFormNameHandled();
    }
  }, [clearNewFormNameTrigger]);

  const handleNewClick = () => {
    setCreating(true);
    setFormReady(false);
    setFormName('');
    setRows([]);
    setNewFormName('');
  };

  const handleConfirmCreate = async () => {
    if (newFormName.trim()) {
      setFormName(newFormName);
      await onCreateForm(newFormName);
      setCreating(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ formName, theme, rows: currentRows }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName || 'form'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (formName) {
      const url = `${window.location.origin}/print?name=${encodeURIComponent(formName)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={1}
      sx={{
        bgcolor: hasUnsavedChanges ? '#fff9c4' : '#f0f0f0',
        borderBottom: '1px solid #ccc'
      }}
    >
      <Typography variant="h6" mr={2}>Form Builder</Typography>

      <Select
        value={formName}
        onChange={(e) => onLoadForm(e.target.value)}
        displayEmpty
        sx={{ minWidth: 200, mr: 2 }}
      >
        <MenuItem value="">Select Form</MenuItem>
        {availableForms.map((name) => (
          <MenuItem key={name} value={name}>{name}</MenuItem>
        ))}
      </Select>

      <IconButton onClick={handleNewClick} color="primary" sx={{ mr: 1 }}>
        <AddIcon />
      </IconButton>

      <TextField
        size="small"
        label="New Form Name"
        value={newFormName}
        onChange={(e) => setNewFormName(e.target.value)}
        sx={{ mr: 1 }}
        disabled={!creating}
        onKeyDown={(e) => e.key === 'Enter' && handleConfirmCreate()}
      />

      <IconButton
        onClick={onSaveForm}
        color="success"
        disabled={creating ? !newFormName.trim() : !formName || !formName.trim()}
      >
        <SaveIcon />
      </IconButton>

      <IconButton onClick={handleExportJSON} color="info" title="Download JSON">
        <DownloadIcon />
      </IconButton>
      <IconButton onClick={handlePrint} title="Print Form">
        <PrintIcon />
      </IconButton>

      <Box ml="auto" display="flex" alignItems="center">
        <Typography mr={1}>Theme:</Typography>
        <Select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          size="small"
        >
          {Object.keys(themes).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default FormManagement;
