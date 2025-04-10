// models/formModel.js
const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema({
  type: String,
  content: String,
  label: String,
  inputType: String,
  hAlign: String,
  vAlign: String
}, { _id: false });

const cellSchema = new mongoose.Schema({
  id: String,
  widthRatio: Number,
  control: controlSchema
}, { _id: false });

const rowSchema = new mongoose.Schema({
  id: String,
  height: Number,
  cells: [cellSchema]
}, { _id: false });

const formSchema = new mongoose.Schema({
  formName: { type: String, required: true },
  theme: String,
  rows: [rowSchema]
});

module.exports = mongoose.model('Form', formSchema);
