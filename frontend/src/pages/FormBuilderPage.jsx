// ✅ FormBuilderPage.jsx — now saves new form using newFormName
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
  const [newFormName, setNewFormName] = useState('');
  const [availableForms, setAvailableForms] = useState([]);
  const [theme, setTheme] = useState('blue-sky');
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [formReady, setFormReady] = useState(false);
  const [triggerClearNewFormInput, setTriggerClearNewFormInput] = useState(false);
  const [initialState, setInitialState] = useState({ rows: [], theme: 'blue-sky' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    getAllFormNames().then(setAvailableForms);
  }, []);

  useEffect(() => {
    const stringify = (obj) => JSON.stringify(obj);
    const current = stringify({ rows, theme });
    const saved = stringify(initialState);
    setHasUnsavedChanges(current !== saved);
  }, [rows, theme, initialState]);

  const handleLoadForm = async (name) => {
    if (!name) {
      setFormName('');
      setRows([]);
      setTheme('blue-sky');
      setFormReady(false);
      return;
    }
    const form = await getFormByName(name);
    setFormName(name);
    setRows(form.rows || []);
    setTheme(form.theme || 'blue-sky');
    setInitialState({ rows: form.rows || [], theme: form.theme || 'blue-sky' });
    setSelectedRowId(null);
    setSelectedCellId(null);
    setFormReady(true);
    setTriggerClearNewFormInput(true);
  };

  const handleCreateForm = async (name) => {
    await createForm(name);
    setFormName(name);
    setRows([]);
    setTheme('blue-sky');
    setInitialState({ rows: [], theme: 'blue-sky' });
    setAvailableForms((prev) => [...prev, name]);
    setSelectedRowId(null);
    setSelectedCellId(null);
    setFormReady(false);
  };

  const handleSaveForm = async () => {
    let nameToSave = formName;
    if (!nameToSave && newFormName?.trim()) {
      nameToSave = newFormName.trim();
      setFormName(nameToSave);
    }

    if (!nameToSave || !nameToSave.trim()) {
      console.warn('Form name is required to save.');
      alert('Please enter a form name before saving.');
      return;
    }

    await saveForm(nameToSave, { formName: nameToSave, theme, rows });
    setFormReady(true);
    setInitialState({ rows, theme });
    setHasUnsavedChanges(false);
  };

  return (
    <Box display="flex" height="100vh">
      <ControlSidebar
        rows={rows}
        setRows={setRows}
        selectedCellId={selectedCellId}
        theme={themes[theme]}
        disabled={!formReady}
      />
      <Box flex={1} display="flex" flexDirection="column" overflow="auto">
        <FormManagement
          formName={formName}
          setFormName={setFormName}
          newFormName={newFormName}
          setNewFormName={setNewFormName}
          availableForms={availableForms}
          onLoadForm={handleLoadForm}
          onCreateForm={handleCreateForm}
          onSaveForm={handleSaveForm}
          theme={theme}
          setTheme={setTheme}
          currentRows={rows}
          formReady={formReady}
          setRows={setRows}
          setFormReady={setFormReady}
          clearNewFormNameTrigger={triggerClearNewFormInput}
          onClearNewFormNameHandled={() => setTriggerClearNewFormInput(false)}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        {formReady && (
          <>
            <RowToolbar rows={rows} setRows={setRows} selectedRowId={selectedRowId} />
            <CellToolbar rows={rows} setRows={setRows} selectedCellId={selectedCellId} />
          </>
        )}
        <GridBuilder
          rows={rows}
          setRows={setRows}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          selectedCellId={selectedCellId}
          setSelectedCellId={setSelectedCellId}
          theme={themes[theme]}
          disabled={!formReady}
        />
        {formReady && (
          <div className="debug-border">
            <FormPreview rows={rows} theme={themes[theme]} />
          </div>
        )}
      </Box>
      {formReady && (
        <ControlConfigSidebar
          rows={rows}
          setRows={setRows}
          selectedCellId={selectedCellId}
          theme={themes[theme]}
        />
      )}
    </Box>
  );
};

export default FormBuilderPage;
