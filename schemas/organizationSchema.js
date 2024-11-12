const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
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

module.exports = organizationSchema;
