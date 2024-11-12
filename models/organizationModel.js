const mongoose = require('mongoose');
const organizationSchema = require('../schemas/organizationSchema');

const organizationModel = mongoose.model('Organization', organizationSchema);

module.exports = {
    organizationModel
};