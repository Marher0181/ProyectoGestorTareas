const express = require('express');
const router = express.Router();
const { organizationModel } = require('../models/organizationModel');

router.post('/', (req, res) => {
  res.send('Hello world from Organization!');
});

router.post('/add', async (req, res) => {
  try {
    const { nombre, tipo, codigo } = req.body;
    console.log(req.body);
    if (!nombre || !tipo || !codigo) {
      return res.status(400).json({ message: 'Hace falta un campo, por favor, rellene todos correctamente' });
    }

    const existingOrganization = await organizationModel.findOne({ codigo });
    if (existingOrganization) {
      return res.status(400).json({ message: 'Ya existe una organización con ese código' });
    }
    
    const organization = new organizationModel({
      nombre,
      tipo,
      codigo,
      eliminado: false 
    });

    const savedOrganization = await organization.save();
    return res.status(201).json({ organization: savedOrganization });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const organizations = await organizationModel.find({ eliminado: false });

    if (!organizations || organizations.length === 0) {
      return res.status(404).json({ message: 'No se encontraron organizaciones' });
    }

    return res.status(200).json({ organizations });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, codigo } = req.body;

    if (!nombre || !tipo || !codigo) {
      return res.status(400).json({ message: 'Hace falta un campo, por favor, rellene todos correctamente' });
    }

    const organization = await organizationModel.findById(id);

    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    const existingOrganization = await organizationModel.findOne({ codigo });
    if (existingOrganization && existingOrganization._id.toString() !== id) {
      return res.status(400).json({ message: 'Ya existe una organización con ese código' });
    }

    organization.nombre = nombre;
    organization.tipo = tipo;
    organization.codigo = codigo;

    const updatedOrganization = await organization.save();

    return res.status(200).json({ organization: updatedOrganization });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await organizationModel.findById(id);

    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    organization.eliminado = true;

    const deletedOrganization = await organization.save();

    return res.status(200).json({ message: 'Organización eliminada correctamente', organization: deletedOrganization });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;
