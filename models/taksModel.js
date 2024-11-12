const mongoose = require('mongoose');
const taskSchema = require('../schemas/taskSchema');

const taskModel = mongoose.model('Task', taskSchema);

module.exports = {
    taskModel
};