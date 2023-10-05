const query = require('../config/db')

const createGetHired = async (
  name,
  email,
  phone,
  country,
  resume,
  willingtorelocate,
  jobspeciality,
  leveledu,
  clearance,
  message
) => {
  const sql = `INSERT INTO gethiredform (name,email,phone,country,resume,willingtorelocate,jobspeciality,leveledu,clearance,message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`
  const result = await query(sql, [
    name,
    email,
    phone,
    country,
    resume,
    willingtorelocate,
    jobspeciality,
    leveledu,
    clearance,
    message,
  ])
  return result
}
const createGetHiredbyRecruiter = async (
  name,
  email,
  phone,
  country,
  resume,
  willingtorelocate,
  jobspeciality,
  leveledu,
  clearance,
  message,
  recruiterId
) => {
  const sql = `INSERT INTO gethiredform (name,email,phone,country,resume,willingtorelocate,jobspeciality,leveledu,clearance,message,recruiterId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`
  const result = await query(sql, [
    name,
    email,
    phone,
    country,
    resume,
    willingtorelocate,
    jobspeciality,
    leveledu,
    clearance,
    message,
    recruiterId,
  ])
  return result
}

const getAllHiredForm = async (queries) => {
  const sql = queries
  const result = await query(sql)
  return result
}

const getFormById = async (id) => {
  const sql = 'SELECT * FROM gethiredform WHERE id = ?'
  const result = await query(sql, [id])
  return result
}
const DeleteFormById = async (id) => {
  const sql = 'DELETE FROM gethiredform WHERE id = ?'
  const result = await query(sql, [id])
  return result
}

module.exports = {
  createGetHired,
  getAllHiredForm,
  getFormById,
  DeleteFormById,
  createGetHiredbyRecruiter,
}
