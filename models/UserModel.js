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

const editUserbyID = async (
  email,
  phone,
  location,
  gender,
  language,
  dob,
  id
) => {
  const sql =
    'UPDATE user SET email = ?, phone = ?, location = ?, gender = ?, language = ?, dob = ? WHERE id = ?'

  const result = await query(sql, [
    email,
    phone,
    location,
    gender,
    language,
    dob,
    id,
  ])
  console.log('result')
  return result[0]
}

const updateUserPassword = async (password, id) => {
  const sql = 'UPDATE user SET password = ? WHERE id = ?'

  const result = await query(sql, [password, id])
  console.log('result')
  return result[0]
}

const createReset = async (code, email) => {
  const sql = `INSERT INTO resetpassword (code,email) VALUES (?, ?)`

  const result = await query(sql, [code, email])
  console.log('result')
  return result[0]
}

const updateReset = async (code, email) => {
  const sql = 'UPDATE resetpassword SET code = ? WHERE email = ?'

  const result = await query(sql, [code, email])
  console.log('result')
  return result[0]
}
const getResetByEmail = async (email) => {
  const sql = 'SELECT * FROM resetpassword WHERE email = ?'
  const result = await query(sql, [email])
  console.log('result')
  return result[0]
}

const verifyCode = async (email, code) => {
  const sql = 'SELECT * FROM resetpassword WHERE email = ? AND code = ?'
  const result = await query(sql, [email, code])
  console.log('result')
  return result[0]
}
const resetUserPassword = async (password, email) => {
  const sql = 'UPDATE user SET password = ? WHERE email = ?'

  const result = await query(sql, [password, email])
  console.log('result')
  return result[0]
}
module.exports = {
  getUserById,
  getUserByEmail,
  registerAdminPortalUser,
  getPortalUserById,
  registerCompanyPortalUser,
  editUserbyID,
  updateUserPassword,
  createReset,
  updateReset,
  getResetByEmail,
  verifyCode,
  resetUserPassword,
}
