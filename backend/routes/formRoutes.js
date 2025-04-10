// backend/routes/formRoutes.js
const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');

// GET /api/forms/names – all form names
router.get('/names', async (req, res) => {
  try {
    const forms = await Form.find({}, 'formName');
    const names = forms.map(f => f.formName);
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/forms/:formName – get form by name
router.get('/:formName', async (req, res) => {
  try {
    const form = await Form.findOne({ formName: req.params.formName });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/forms/create – create a new form
router.post('/create', async (req, res) => {
  const { formName } = req.body;
  try {
    const existing = await Form.findOne({ formName });
    if (existing) return res.status(400).json({ error: 'Form already exists' });

    const newForm = new Form({ formName, rows: [], theme: 'blue-sky' });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/forms/:formName – update or save form
router.put('/:formName', async (req, res) => {
  try {
    const updated = await Form.findOneAndUpdate(
      { formName: req.params.formName },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
