const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const employee = require("../models/employeeModel");
const jwt = require('jsonwebtoken');
const { organizationModel } = require('../models/organizationModel');
const SECRET_KEY = 'project_secret'

router.post('/', async (req, res) => {
  res.send('Hello world!');
});

router.post('/register', async (req, res) => {
    const { nombre, pass, codigo, email } = req.body;
    
    try {
        if(!nombre || !pass || !codigo || !email){
            return res.status(400).json({ message: 'Hace falta un campo, por favor, rellene todos correctamente' });
        }
        const organizacion = await organizationModel.findOne({"codigo": codigo})
        console.log(organizacion.codigo)
        //const employee = new employeeModel({
        //    nombre, rol, 
        //})
        const hashedPassword = await bcrypt.hash(pass, 10);
        res.status(201).json({ message: 'Usuario registrado correctamente', result });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
  });

module.exports = router;
