const sql = require('mssql')

const config = {
  server: 'localhost',
  database: 'trabalhodb',
  user: 'sa',
  password: 'Senha123@',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool = null

async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

module.exports = { getConnection, sql }
