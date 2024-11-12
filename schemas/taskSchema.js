const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  Department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  progresion: {
    type: String,
    required: true
  },
  fechaFinalizacion: {
    type: Date,
    default: Date.now
  },
  Asignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
});

module.exports = taskSchema;
