const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { organizationModel } = require('../models/organizationModel');
const { departmentModel } = require('../models/departmentModel')
const department = require("../models/departmentModel");

router.post('/', async (req, res) => {
  res.send('Hello world from Department!');
});

router.post('/add', async (req, res) => {
  try {

    const nombre = req.body?.nombre;
    const Organization = await organizationModel.findOne({"codigo": req.body?.codigo})
    if (!nombre || !req.body?.codigo) {
      return res.status(400).json({ message: 'Hace falta un campo, por favor, rellene todos correctamente' });
    }

    const eliminado = false
    const codigo = "c123123"

    const department = new departmentModel({
      nombre,
      Organization,
      eliminado,
      codigo
    });

    const save = await department.save();
    return res.status(201).json({ Department: save });

  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
