const mongoose = require('mongoose');
const employeeSchema = require('../schemas/employeeSchema');

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = {
    employeeModel
};