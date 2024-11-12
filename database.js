const mongoose = require('mongoose');
const uri = 'mongodb+srv://administrador_607:whsLF7P9@practica6.hmwrf.mongodb.net/PracticaNo9?retryWrites=true&w=majority';

const db = mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch(err => console.log("Error de conexión a MongoDB", err));

module.exports = {
    db
}