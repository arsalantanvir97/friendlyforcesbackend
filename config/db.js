const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
  connectionLimit: 100,
  host: '89.116.70.47',
  user: 'dedicatetestserver_friendlylive',
  password: '4MEvscvi',
  database: 'dedicatetestserver_friendlyforceslive',
})

// Promisify the pool query method
const query = util.promisify(pool.query).bind(pool)

module.exports = query
