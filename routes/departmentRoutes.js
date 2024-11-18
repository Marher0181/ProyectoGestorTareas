const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { organizationModel } = require('../models/organizationModel');
const { departmentModel } = require('../models/departmentModel');
const verificarTokenYRol = require('../middlewares/middlewaresauth');


router.post('/', async (req, res) => {
  res.send('Hello world from Department!');
});

router.post('/add', verificarTokenYRol('Administrador Org'), async (req, res) => {
  try {
    const { nombre, codigo, codigoOrg } = req.body;

    if (!nombre || !codigo || !codigoOrg) {
      return res.status(400).json({ message: 'Hace falta un campo, por favor, rellene todos correctamente' });
    }

    const organization = await organizationModel.findOne({ "codigo": codigoOrg });

    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    const department = new departmentModel({
      nombre,
      Organization: organization, 
      eliminado: false,
      codigo
    });
    console.log(department);
    const savedDepartment = await department.save();
    return res.status(201).json({ department: savedDepartment });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/', verificarTokenYRol('Administrador Org'), async (req, res) => {
  try {
    const departments = await departmentModel.find({ eliminado: false }).populate('Organization', 'nombre codigo');

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron departamentos' });
    }

    return res.status(200).json({ departments });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.put('/update/:id', verificarTokenYRol('Administrador Org'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({ message: 'Hace falta un campo, por favor, rellene todos correctamente' });
    }

    const department = await departmentModel.findById(id);

    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado' });
    }

    const organization = await organizationModel.findOne({ codigo });

    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    department.nombre = nombre;
    department.organization = organization;

    const updatedDepartment = await department.save();

    return res.status(200).json({ department: updatedDepartment });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.delete('/delete/:id', verificarTokenYRol('Administrador Org'), async (req, res) => {
  try {
    const { id } = req.params;

    const department = await departmentModel.findById(id);

    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado' });
    }

    department.eliminado = true;

    const deletedDepartment = await department.save();

    return res.status(200).json({ message: 'Departamento eliminado correctamente', department: deletedDepartment });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;
