// src/api/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/forms';

// Get all form names
export const getAllFormNames = async () => {
  const res = await axios.get(`${BASE_URL}/names`);
  return res.data;
};

// Get full form definition by name
export const getFormByName = async (formName) => {
  const res = await axios.get(`${BASE_URL}/${formName}`);
  return res.data;
};

// Create a new form (empty template)
export const createForm = async (formName) => {
  const res = await axios.post(`${BASE_URL}/create`, { formName });
  return res.data;
};

// Save or update a form
export const saveForm = async (formName, formData) => {
  const res = await axios.put(`${BASE_URL}/${formName}`, formData);
  return res.data;
};
