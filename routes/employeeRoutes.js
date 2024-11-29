const express = require('express');
const router = express.Router();
const { employeeModel } = require('../models/employeeModel');
const { organizationModel } = require('../models/organizationModel');
const { departmentModel } = require('../models/departmentModel');
const bcrypt = require('bcryptjs');
const verificarTokenYRol = require('../middlewares/middlewaresauth');

router.post('/', async (req, res) => {
  res.send('Hello world from Employee!');
});

router.post('/add', verificarTokenYRol('Administrador Dept'), async (req, res) => {
  try {
    const { nombre, rol, codigo, pass, email } = req.body;

    if (!nombre || !rol || !codigo || !pass || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const orgCodigo = codigo.slice(0, 8);
    const deptCodigo = codigo.slice(8, 16);
    const organization = await organizationModel.findOne({ codigo: orgCodigo });
    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    const department = await departmentModel.findOne({ codigo: deptCodigo});
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado en esta organización' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);

    const employee = new employeeModel({
      nombre,
      rol,
      Department: department,
      pass: hashedPass,
      email
    });

    const savedEmployee = await employee.save();
    return res.status(201).json({ employee: savedEmployee });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, codigo, pass, email } = req.body;

    if (!nombre || !codigo || !pass || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const orgCodigo = codigo.slice(0, 8);
    const deptCodigo = codigo.slice(8, 16);
    const organization = await organizationModel.findOne({ codigo: orgCodigo });
    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    const department = await departmentModel.findOne({ codigo: deptCodigo});
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado en esta organización' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);

    const employee = new employeeModel({
      nombre,
      rol: 'Empleado',
      Department: department,
      pass: hashedPass,
      email
    });

    const savedEmployee = await employee.save();
    return res.status(201).json({ employee: savedEmployee });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/newAdminDept', verificarTokenYRol('Administrador Dept' || 'Administrador Org'), async (req, res) => {
  try {
    const { nombre, pass, email } = req.body;

    if (!nombre || !pass || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const orgCodigo = codigo.slice(0, 8);
    const deptCodigo = codigo.slice(8, 16);
    const organization = await organizationModel.findOne({ codigo: orgCodigo });
    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    const department = await departmentModel.findOne({ codigo: deptCodigo});
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado en esta organización' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);

    const employee = new employeeModel({
      nombre,
      rol: 'Empleado',
      Department: department,
      pass: hashedPass,
      email
    });

    const savedEmployee = await employee.save();
    return res.status(201).json({ employee: savedEmployee });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const employees = await employeeModel.find();

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: 'No se encontraron empleados' });
    }

    return res.status(200).json({ employees });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/:id', verificarTokenYRol('Administrador Dept'), async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await employeeModel.findById(id).populate('Department');

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    return res.status(200).json({ employee });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.put('/update/:id', verificarTokenYRol('Administrador Dept'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rol, pass, email, codigo } = req.body;

    if (!nombre || !rol || !codigo || !pass || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const orgCodigo = codigo.slice(0, 8); 
    const deptCodigo = codigo.slice(8);

    const organization = await organizationModel.findOne({ codigo: orgCodigo });
    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    const department = await departmentModel.findOne({ codigo: deptCodigo, organization: organization._id });
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado en esta organización' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);

    const employee = await employeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    employee.nombre = nombre;
    employee.rol = rol;
    employee.pass = hashedPass;
    employee.email = email;
    employee.Department = department._id;

    const updatedEmployee = await employee.save();

    return res.status(200).json({ employee: updatedEmployee });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.delete('/delete/:id', verificarTokenYRol('Administrador Dept'), async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await employeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await employee.remove();
    return res.status(200).json({ message: 'Empleado eliminado correctamente' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;
    console.log(req.body);
    if (!email || !pass) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const employee = await employeeModel.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const isMatch = await bcrypt.compare(pass, employee.pass);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: employee._id, nombre: employee.nombre, rol: employee.rol, Department: employee.Department }, 'gestor_app_project', { expiresIn: '8h' });

    return res.status(200).json({ message: 'Login exitoso', token, rol: employee.rol, id: employee._id });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;
