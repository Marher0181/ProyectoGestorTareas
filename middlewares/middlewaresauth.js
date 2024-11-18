const jwt = require('jsonwebtoken');

const verificarTokenYRol = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, 'gestor_app_project');
      console.log(decoded)
      req.user = decoded;

      if (requiredRole && req.user.rol !== requiredRole) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
  };
};

module.exports = verificarTokenYRol;
