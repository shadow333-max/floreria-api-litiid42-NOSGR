const express = require('express');
const router = express.Router();
const floreriaController = require('../controllers/floreriaController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
const { validateFloreria } = require('../middlewares/validator');
const upload = require('../config/multer');

/**
 * @swagger
 * /api/florerias/stats:
 *   get:
 *     summary: Obtener estadísticas de florerías
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 */
//router.get('/stats', authenticateToken, floreriaController.getStats);

/**
 * @swagger
 * /api/florerias:
 *   get:
 *     summary: Listar todas las florerías
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *       - in: query
 *         name: estatus
 *         schema:
 *           type: string
 *           enum: [activo, inactivo]
 *         description: Filtrar por estatus
 *       - in: query
 *         name: id_ciudad
 *         schema:
 *           type: integer
 *         description: Filtrar por ciudad
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o descripción
 *     responses:
 *       200:
 *         description: Lista de florerías
 */
router.get('/', authenticateToken, floreriaController.getAll);

/**
 * @swagger
 * /api/florerias/{id}:
 *   get:
 *     summary: Obtener una florería por ID
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la florería
 *     responses:
 *       200:
 *         description: Florería encontrada
 *       404:
 *         description: Florería no encontrada
 */
router.get('/:id', authenticateToken, floreriaController.getById);

/**
 * @swagger
 * /api/florerias:
 *   post:
 *     summary: Crear nueva florería
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - id_ciudad
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Flores del Valle
 *               descripcion:
 *                 type: string
 *                 example: Especialistas en arreglos florales
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del logo (JPG, PNG, WEBP - Máx 5MB)
 *               ubicacion:
 *                 type: string
 *                 example: Av. Reforma 123
 *               telefono:
 *                 type: string
 *                 example: 5555-1234
 *               email:
 *                 type: string
 *                 example: contacto@flores.com
 *               horario:
 *                 type: string
 *                 example: Lun-Sab 9:00-19:00
 *               estatus:
 *                 type: string
 *                 enum: [activo, inactivo]
 *                 default: activo
 *               id_ciudad:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Florería creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  authenticateToken,
  upload.single('logo'), // Campo 'logo' en FormData
  validateFloreria,
  floreriaController.create
);

/**
 * @swagger
 * /api/florerias/{id}:
 *   put:
 *     summary: Actualizar florería
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               horario:
 *                 type: string
 *               estatus:
 *                 type: string
 *                 enum: [activo, inactivo]
 *               id_ciudad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Florería actualizada
 *       404:
 *         description: Florería no encontrada
 */
router.put(
  '/:id',
  authenticateToken,
  upload.single('logo'),
  floreriaController.update
);

/**
 * @swagger
 * /api/florerias/{id}:
 *   delete:
 *     summary: Eliminar florería
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Florería eliminada
 *       404:
 *         description: Florería no encontrada
 */
router.delete('/:id', authenticateToken, floreriaController.delete);

/**
 * @swagger
 * /api/florerias/ciudad/{idCiudad}:
 *   get:
 *     summary: Obtener florerías por ciudad
 *     tags: [Florerías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCiudad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Florerías encontradas
 */
 //router.get('/ciudad/:idCiudad', authenticateToken, floreriaController.getByCiudad);

module.exports = router;