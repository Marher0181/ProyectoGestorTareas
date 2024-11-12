const mongoose = require('mongoose');
const departmentSchema = require('../schemas/departmentSchema');

const departmentModel = mongoose.model('Department', departmentSchema);

module.exports = {
    departmentModel
};