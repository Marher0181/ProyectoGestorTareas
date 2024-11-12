const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  Organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },
  eliminado: {
    type: Boolean,
    required: true
  },
  codigo: {
    type: String,
    required: true
  }
});

module.exports = departmentSchema;
