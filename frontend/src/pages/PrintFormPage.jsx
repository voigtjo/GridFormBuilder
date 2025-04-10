// src/pages/PrintFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFormByName } from '../api/api';
import FormPreview from '../components/FormPreview';
import { themes } from '../utils/themeOptions';
import '../styles/print.css';

const PrintFormPage = () => {
  const [params] = useSearchParams();
  const formName = params.get('name');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (formName) {
      getFormByName(formName).then(setFormData);
    }
  }, [formName]);

  useEffect(() => {
    if (formData) {
      setTimeout(() => window.print(), 300);
    }
  }, [formData]);

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="printable-preview">
      <FormPreview
        rows={formData.rows}
        theme={themes[formData.theme] || themes['blue-sky']}
      />
    </div>
  );
};

export default PrintFormPage;
