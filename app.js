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
const nodemailer = require('nodemailer');

app.use(express.json());

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000', // Permite cualquier origen en producción
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Crear el servidor HTTP y el WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000', // Permite conexiones WebSocket desde cualquier origen en producción
    methods: ['GET', 'POST', 'PUT'],
  }
});

io.on('connection', (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Configuración de rutas
app.use('/api/v1/organization', organizationRoutes);
app.use('/api/v1/department', departmentRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/task', taskRoutes(io));

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://administrador_607:whsLF7P9@practica6.hmwrf.mongodb.net/PracticaNo9?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.log('Error de conexión:', err));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  } else {
    console.log(`Servidor ejecutándose en https://miapp.render.com`);
  }
});
