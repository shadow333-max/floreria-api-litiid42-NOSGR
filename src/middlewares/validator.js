const Joi = require('joi');
const { errorResponse } = require('../utils/response');

// reglas de validación para registro
const registerSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede tener más de 100 caracteres'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'string.empty': 'El email es obligatorio'
  }),
  password: Joi.string().min(6).max(50).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'string.empty': 'La contraseña es obligatoria'
  }),
  rol: Joi.string().valid('admin', 'user').default('user')
});

// reglas de validación para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// reglas de validación para florería
const floreriaSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 3 caracteres'
  }),
  descripcion: Joi.string().max(1000).allow('', null),
  ubicacion: Joi.string().max(255).allow('', null),
  telefono: Joi.string().max(20).allow('', null),
  email: Joi.string().email().allow('', null),
  horario: Joi.string().max(100).allow('', null),
  estatus: Joi.alternatives().try(Joi.string().valid('activo', 'inactivo', 'pendiente', '1', '0', '2'),Joi.number().valid(1, 0, 2)).default(1),
  id_ciudad: Joi.number().integer().required().messages({
    'number.base': 'El ID de ciudad debe ser un número',
    'any.required': 'El ID de ciudad es obligatorio'
  })
});

// middleware de validación genérico
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // muestra todos los errores
      stripUnknown: true // elimina campos no definidos en el esquema de validaci
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json(
        errorResponse('Errores de validación', 400, errors)
      );
    }

    // reemplazar req.body con los valores validados
    req.body = value;
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateFloreria: validate(floreriaSchema)
};