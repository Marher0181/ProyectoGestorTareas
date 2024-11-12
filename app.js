const express = require('express');
const mongoose = require('mongoose');
const app = express()
const db = require("./database")
const organizationRoutes = require("./routes/organizationRoutes")
const departmentRoutes = require("./routes/departmentRoutes")
const employeeRoutes = require("./routes/employeeRoutes")
const taskRoutes = require("./routes/taskRoutes")

app.use(express.json());
const PORT = process.env.port || 4000;

app.use('/api/v1/organization', organizationRoutes); 
app.use('/api/v1/department', departmentRoutes)
app.use('/api/v1/employee', employeeRoutes)
app.use('/api/v1/task', taskRoutes)


app.listen(PORT, () => {
    console.log(`Server listen on http://localhost:${PORT}`);
  });

