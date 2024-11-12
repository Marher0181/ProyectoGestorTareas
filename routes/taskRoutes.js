const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const task = require("../models/taksModel");

router.post('/', async (req, res) => {
  res.send('Hello world!');
});

module.exports = router;
