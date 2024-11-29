const express = require('express');
const router = express.Router();
const { taskModel } = require("../models/taksModel");
const verificarTokenYRol = require('../middlewares/middlewaresauth');
const { departmentModel } = require("../models/departmentModel")
const nodemailer = require('nodemailer');
module.exports = (io) => {
router.post('/add', async (req, res) => {
  try {
    const { nombre, descripcion, fechaFinalizacion, DepartmentId } = req.body;

    if (!nombre || !descripcion || !DepartmentId) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }
    const department = await departmentModel.findOne({ _id: DepartmentId});
    const task = new taskModel({
      nombre,
      descripcion,
      progresion: "No iniciado",
      fechaFinalizacion,
      Department: department,
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
    const tasks = await taskModel.find().populate('Asignado', 'nombre email');

    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    const tasksToExpire = tasks.filter(task => {
      const dueDate = new Date(task.fechaFinalizacion);
      const timeDifference = dueDate - now;
      return timeDifference > 0 && timeDifference <= oneDayInMs;
    });

    if (tasksToExpire.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'marlonher01818@gmail.com',
          pass: 'wcaa hcoh izrp yphn'      
        }
      });

      for (const task of tasksToExpire) {
        const assignedEmployee = task.Asignado;
        if (assignedEmployee && assignedEmployee.email) {
          const mailOptions = {
            from: '"Gestor de Tareas" marlonher01818@gmail.com',
            to: assignedEmployee.email,
            subject: `Recordatorio: Tarea próxima a vencer`,
            text: `Hola ${assignedEmployee.nombre},\n\nLa tarea "${task.nombre}" está programada para vencer el ${task.fechaFinalizacion}.\nPor favor, asegúrate de completarla a tiempo.\n\nGracias.`,
            html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recordatorio de Tarea</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .header {
            background-image: url('https://imgs.search.brave.com/nwdyy3TPU2fvZn_aN5ppZ1s8uTlvDDrN8hj1hZeHW8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMWVp/cG0zdno0MGh5MC5j/bG91ZGZyb250Lm5l/dC9pbWFnZXMvU1NB/Qy1CbG9nL3Npc3Rl/bWEtZGUtZ2VzdGlv/bi1kZS10aWNrZXRz/LmpwZw');
            background-size: cover;
            background-position: center;
            padding: 40px 20px;
            text-align: center;
            color: #fff;
        }
        .header h1 {
            margin: 0;
            font-size: 36px;
        }
        .header p {
            margin: 0;
            font-size: 18px;
        }
        .content {
            padding: 20px;
            text-align: left;
            background-color: #fff;
            border-top: 4px solid #007bff;
        }
        .content h2 {
            font-size: 28px;
            color: #333;
        }
        .content p {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
        }
        .footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 20px 0;
            font-size: 14px;
        }
        .footer a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Recordatorio de Tarea</h1>
        <p>Gestor Tareas</p>
    </div>

    <div class="content">
        <h2>Estimado/a ${assignedEmployee.nombre},</h2>
        <p>Esta es una notificación para recordarte que la tarea <strong>"${task.nombre}"</strong> está programada para vencer el <strong>${task.fechaFinalizacion}</strong>.</p>
        <p>Por favor, asegúrate de completarla antes de la fecha de vencimiento.</p>
        <p>Atentamente, <br> El equipo de Gestor Tareas</p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>&copy; 2024 Gestor Tareas. Todos los derechos reservados.</p>
        <p><a href="mailto:soporte@gestortareas.com">soporte@gestortareas.com</a></p>
    </div>
</body>
</html>`
          };

          await transporter.sendMail(mailOptions);
          console.log(`Correo enviado a ${assignedEmployee.nombre}, con el correo ${assignedEmployee.email} para la tarea: ${task.nombre}`);
        }
      }
    }

    return res.status(200).json({ tasks, tasksToExpire });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
  }
});

module.exports = router;

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

  router.put('/update/:id',  async (req, res) => {
    try {
      const { nombre, descripcion, progresion, fechaFinalizacion, DepartmentId } = req.body;

      const updatedTask = await taskModel.findByIdAndUpdate(
        req.params.id,
        { nombre, descripcion, progresion, fechaFinalizacion, Department: DepartmentId },
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

  router.put('/updateStatusInProgress',  async (req, res) => {
    try {

      const updatedTask = await taskModel.findByIdAndUpdate(
        req.body.id,
        { progresion: "En proceso"},
        { new: true }
      ).populate('Department');

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      io.emit('task-updated', updatedTask);

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cambiar la progresión de la tarea', error: error.message });
    }
  });

  router.put('/updateStatusCancelled',  async (req, res) => {
    try {

      const updatedTask = await taskModel.findByIdAndUpdate(
        req.body.id,
        { progresion: "Cancelado"},
        { new: true }
      ).populate('Department');

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      io.emit('task-updated', updatedTask);

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cambiar la progresión de la tarea', error: error.message });
    }
  });

  router.put('/updateStatusToDo',  async (req, res) => {
    try {

      const updatedTask = await taskModel.findByIdAndUpdate(
        req.body.id,
        { progresion: "No iniciado"},
        { new: true }
      ).populate('Department');

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      io.emit('task-updated', updatedTask);

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cambiar la progresión de la tarea', error: error.message });
    }
  });

  router.put('/updateStatusFinished',  async (req, res) => {
    try {

      const updatedTask = await taskModel.findByIdAndUpdate(
        req.body.id,
        { progresion: "Finalizado"},
        { new: true }
      ).populate('Department');

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      io.emit('task-updated', updatedTask);

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cambiar la progresión de la tarea', error: error.message });
    }
  });

  router.delete('/delete/:id',  async (req, res) => {
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
