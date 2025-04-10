// ✅ src/pages/FormBuilderPage.jsx
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FormManagement from '../components/FormManagement';
import GridBuilder from '../components/GridBuilder';
import RowToolbar from '../components/RowToolbar';
import CellToolbar from '../components/CellToolbar';
import ControlSidebar from '../components/ControlSidebar';
import ControlConfigSidebar from '../components/ControlConfigSidebar';
import FormPreview from '../components/FormPreview';
import { getAllFormNames, getFormByName, createForm, saveForm } from '../api/api';
import { themes } from '../utils/themeOptions';
import '../styles/print.css';

const FormBuilderPage = () => {
  const [formName, setFormName] = useState('');
  const [availableForms, setAvailableForms] = useState([]);
  const [theme, setTheme] = useState('blue-sky');
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState(null);

  useEffect(() => {
    getAllFormNames().then(setAvailableForms);
  }, []);

  const handleLoadForm = async (name) => {
    const form = await getFormByName(name);
    setFormName(name);
    setRows(form.rows || []);
    setTheme(form.theme || 'blue-sky');
    setSelectedRowId(null);
    setSelectedCellId(null);
  };

  const handleCreateForm = async (name) => {
    const newForm = await createForm(name);
    setFormName(name);
    setRows([]);
    setTheme('blue-sky');
    setAvailableForms((prev) => [...prev, name]);
  };

  const cleanRowsBeforeSaving = (rows) => {
    return rows.map(row => ({
      ...row,
      cells: row.cells.map(cell => {
        const control = cell.control ? { ...cell.control } : null;
        return {
          ...cell,
          control
        };
      })
    }));
  };

  const handleSaveForm = async () => {
    const cleanedRows = cleanRowsBeforeSaving(rows);
    await saveForm(formName, { formName, theme, rows: cleanedRows });
  };

  return (
    <Box display="flex" height="100vh">
      <ControlSidebar
        rows={rows}
        setRows={setRows}
        selectedCellId={selectedCellId}
        theme={themes[theme]}
      />
      <Box flex={1} display="flex" flexDirection="column" overflow="auto">
        <FormManagement
          formName={formName}
          setFormName={setFormName}
          availableForms={availableForms}
          onLoadForm={handleLoadForm}
          onCreateForm={handleCreateForm}
          onSaveForm={handleSaveForm}
          theme={theme}
          setTheme={setTheme}
          currentRows={rows}
        />
        <RowToolbar
          rows={rows}
          setRows={setRows}
          selectedRowId={selectedRowId}
        />
        <CellToolbar
          rows={rows}
          setRows={setRows}
          selectedCellId={selectedCellId}
        />
        <GridBuilder
          rows={rows}
          setRows={setRows}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          selectedCellId={selectedCellId}
          setSelectedCellId={setSelectedCellId}
          theme={themes[theme]}
        />
        <div className="debug-border">
          <FormPreview
            rows={rows}
            theme={themes[theme]}
          />
        </div>
      </Box>
      <ControlConfigSidebar
        rows={rows}
        setRows={setRows}
        selectedCellId={selectedCellId}
        theme={themes[theme]}
      />
    </Box>
  );
};

export default FormBuilderPage;