const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const User1 = require('../models/UserModel')

const { generateJWTtoken } = require('../utills/generateJWTtoken.js')
const { generateEmail } = require('../services/generate_email.js')
const { generateCode } = require('../services/generate_code.js')
async function matchPassword(enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, password)
}
exports.registerAdminPortalUser = async (req, res) => {
  try {
    const { name, email, password, usertype } = req.body

    const portalUserExists = await User1.getUserByEmail(email)
    console.log(portalUserExists)
    if (portalUserExists === undefined) {
      const salt = await bcrypt.genSalt(10)
      const encryptPassword = await bcrypt.hash(password, salt)

      // const registerAdminPortalUser = await PortalUser.registerAdminPortalUser(name,email,password);
      await User1.registerAdminPortalUser(
        name,
        email,
        encryptPassword,
        usertype
      )
        .then((data) => {
          console.log('Data: >>>>>', data)
          return res.status(200).json({
            success: true,
            message: 'Portal User Registered Successfully...',
            error: 'no error',
          })
        })
        .catch((error) => {
          console.log('Error: >>>>>', error.message)
          return res.status(200).json({
            success: false,
            message: error.message,
            error: error.message,
          })
        })
      // console.log(registerAdminPortalUser)
    } else {
      return res.status(400).json({
        success: false,
        message:
          'Entered email id already registered with us. Login to continue',
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('req.body', req.body)
    const portalUserExists = await User1.getUserByEmail(email)
    console.log('portalUserExists', portalUserExists)
    // console.log(portalUserExists)
    if (
      portalUserExists &&
      (await matchPassword(password, portalUserExists.password))
    ) {
      return res.status(200).json({
        success: true,
        message: 'Authorized User',
        id: portalUserExists.id,
        name: portalUserExists.name,
        email: portalUserExists.email,
        usertype: portalUserExists.usertype,
        token: generateJWTtoken(portalUserExists.id),
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid Credentials',
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User1.getPortalUserById(id)
    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
