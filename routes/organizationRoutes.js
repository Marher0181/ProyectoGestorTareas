const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const organization = require("../models/organizationModel");

router.post('/', async (req, res) => {
  res.send('Hello world!');
});

module.exports = router;
