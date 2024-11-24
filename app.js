const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const db = require("./database");
const organizationRoutes = require("./routes/organizationRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Permite solicitudes desde tu cliente React
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Resto de tu configuración de rutas y servidor
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Permite WebSocket desde tu cliente React
    methods: ['GET', 'POST', 'PUT'],
  }
});


io.on('connection', (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

app.use('/api/v1/organization', organizationRoutes);
app.use('/api/v1/department', departmentRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/task', taskRoutes(io));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`);
});
