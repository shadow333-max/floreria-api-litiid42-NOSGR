const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const authController = {
  //  registro de usuario
  register: async (req, res, next) => {
    try {
      const { nombre, email, password, rol } = req.body;

      // verificar si el correo electrónico ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json(
          errorResponse('El correo electrónico ya está registrado', 409)
        );
      }

      // crear usuario
      const userId = await User.create({ nombre, email, password, rol });

      // obtener usuario creado (sin password)
      const user = await User.findById(userId);

      // Generar token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email,
        rol: user.rol
      });

      res.status(201).json(
        successResponse(
          {
            user: {
              id: user.id,
              nombre: user.nombre,
              email: user.email,
              rol: user.rol
            },
            token
          },
          'Usuario registrado exitosamente'
        )
      );
    } catch (error) {
      next(error);
    }
  },

  // inicio de sesión
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // buscar usuario por correo electrónico
      const user = await User.findByEmail(email); 
      
      if (!user) {
        return res.status(401).json(
          errorResponse('Datos de acceso inválidos', 401)
        );
      }

      // verificar si el usuario está activo, recuerden 1= activo, 2=inactivo, 0= eliminado
      if (user.estatus!=1) {
        return res.status(401).json(
          errorResponse('El usuario está inactivo', 401)
        );
      }

      // verificar contraseña
      const isValidPassword = await User.verifyPassword(password, user.contrasenia);
      
      if (!isValidPassword) {
        return res.status(401).json(
          errorResponse('Datos de acceso inválidos', 401)
        );
      }

      // Generar token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email,
        rol: user.rol
      });

      res.json(
        successResponse(
          {
            user: {
              id: user.id,
              name: user.nombre,
              email: user.email,
              rol: user.rol
            },
            token
          },
          'Acceso realizado correctamente'
        )
      );
    } catch (error) {
      next(error);
    }
  },

  // obtener datos de perfil de usuario
  getProfile: async (req, res, next) => {
    try {
      // req.user viene del middleware authenticateToken
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json(
          errorResponse('Usuario no encontrado', 404)
        );
      }

      res.json(
        successResponse(user, 'DAtos de perfil obtenido exitosamente')
      );
    } catch (error) {
      next(error);
    }
  },

  // Cerrar sesión
  logout: async (req, res, next) => {
    try {
      // En JWT no hay logout real del lado del servidor
      // El cliente debe eliminar el token
      res.json(
        successResponse(
          null,
          'Sesión cerrada exitosamente'
        )
      );
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;