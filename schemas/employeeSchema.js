const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  },
  Department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  pass: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = employeeSchema;
