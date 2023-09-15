const query = require('../config/db')

// const getUserById = async (userId) => {
const getUserById = async () => {
  //   const sql = 'SELECT * FROM users WHERE id = ?';
  const sql = 'SELECT * FROM user'
  //   const result = await query(sql, [userId]);
  const result = await query(sql)
  return result
}

const getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM user WHERE email = ?'
  const result = await query(sql, [email])
  console.log('result')
  return result[0]
}

const registerAdminPortalUser = async (name, email, password, usertype) => {
  // const sql = `INSERT INTO employees (name, email, password) VALUES (${name}, ${email}, ${password})`;
  const sql = `INSERT INTO user (name, email, password, usertype) VALUES (?, ?, ?, ?)`
  const result = await query(sql, [name, email, password, usertype])
  return result
}

const getPortalUserById = async (id) => {
  const sql = 'SELECT * FROM user WHERE id = ?'
  const result = await query(sql, [id])
  return result
}

const registerCompanyPortalUser = async (
  username,
  email,
  encryptPassword,
  companyId
) => {
  // const sql = `INSERT INTO employees (username, email, password) VALUES (${username}, ${email}, ${password})`;
  const sql = `INSERT INTO portaluser (username, email, password, companyId, usertype) VALUES (?, ?, ?, ?, 'companyportaladmin')`
  const result = await query(sql, [username, email, encryptPassword, companyId])
  return result
}

module.exports = {
  getUserById,
  getUserByEmail,
  registerAdminPortalUser,
  getPortalUserById,
  registerCompanyPortalUser,
}
