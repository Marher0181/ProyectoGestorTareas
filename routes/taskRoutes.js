const express = require('express');
const router = express.Router();
const taskModel = require("../models/taksModel");
const verificarTokenYRol = require('../middlewares/middlewaresauth');

module.exports = (io) => {
  
  router.post('/add', async (req, res) => {
    try {
      const { nombre, descripcion, progresion, fechaFinalizacion, departmentId } = req.body;

      if (!nombre || !descripcion || !progresion || !departmentId) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
      }

      const task = new taskModel({
        nombre,
        descripcion,
        progresion,
        fechaFinalizacion,
        Department: departmentId,
      });

      const savedTask = await task.save();

      io.emit('task-created', savedTask);

      return res.status(201).json({ task: savedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const tasks = await taskModel.find().populate('Department');
      return res.status(200).json({ tasks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
    }
  });

  router.post('/assign-task', async (req, res) => {
    try {
      const { taskId, employeeId } = req.body;

      if (!taskId || !employeeId) {
        return res.status(400).json({ message: 'Se debe proporcionar el ID de la tarea y el ID del empleado.' });
      }

      const task = await taskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada.' });
      }

      task.Asignado = employeeId;

      const updatedTask = await task.save();

      io.emit('task-updated', updatedTask);

      return res.status(200).json({ message: 'Tarea asignada exitosamente', task: updatedTask });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  });

  router.put('/update/:id', verificarTokenYRol('Administrador Dept'), async (req, res) => {
    try {
      const { nombre, descripcion, progresion, fechaFinalizacion, departmentId } = req.body;

      const updatedTask = await taskModel.findByIdAndUpdate(
        req.params.id,
        { nombre, descripcion, progresion, fechaFinalizacion, Department: departmentId },
        { new: true }
      ).populate('Department');

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      io.emit('task-updated', updatedTask);

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
    }
  });

  router.delete('/delete/:id', verificarTokenYRol('Administrador Dept'), async (req, res) => {
    try {
      const deletedTask = await taskModel.findByIdAndDelete(req.params.id);

      if (!deletedTask) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      io.emit('task-deleted', deletedTask);

      return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
    }
  });

  return router;
};
