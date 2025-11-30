const mysql = require('mysql2/promise');

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'floreria_db',
  waitForConnections: true,
  connectionLimit: 10, // cantidad máxima de 10 conexiones simultáneas
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  decimalNumbers: true
});

// Obtener la conexión a la bd
pool.getConnection()
  .then(connection => {
    console.log('Conexión a MySQL realizada correctamente');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a MySQL: ', err.message);
    process.exit(1);
  });

// función de ayuda para las consultas - evitar reescribir los mismo en cada uso
const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = { pool, query };