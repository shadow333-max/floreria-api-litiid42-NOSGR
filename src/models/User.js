
const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // crear usuario
  static async create(userData) {
    const { nombre, email, password, rol = 'user' } = userData;

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = `
      INSERT INTO usuarios (nombre, correo_electronico, contrasenia, rol) 
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await query(sql, [nombre, email, hashedPassword, rol]);
    return result.insertId;
  }

  // buscar por email
  static async findByEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE correo_electronico = ? LIMIT 1`;
    console.log(sql)
    const users = await query(sql, [email]);
    return users[0] || null;
  }

  // buscar por ID
  static async findById(id) {
    const sql = `SELECT id, nombre, correo_electronico, rol, estatus FROM usuarios WHERE id = ? LIMIT 1`;
    const users = await query(sql, [id]);
    return users[0] || null;
  }

  // verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    console.log(plainPassword + " "+ hashedPassword)
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // actualizar usuario
  static async update(id, userData) { 
    const fields = [];
    const values = [];

    if (userData.nombre) {
      fields.push('nombre = ?');
      values.push(userData.nombre);
    }
    if (userData.email) {
      fields.push('correo_electronico = ?');
      values.push(userData.email);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      fields.push('contrasenia = ?');
      values.push(hashedPassword);
    }

    values.push(id);

    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return this.findById(id);
  }

  // eliminar usuario
  static async delete(id) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }

  // Listar todos los usuarios
  static async findAll() {
    const sql = `SELECT id, nombre, correo_electronico, rol, estatus FROM usuarios ORDER BY id DESC`;
    return await query(sql);
  }
}

module.exports = User;
