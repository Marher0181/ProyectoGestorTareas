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

app.use(express.json());
const server = http.createServer(app); 
const io = socketIo(server);  // Configura socket.io

// Define la conexión WebSocket
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
