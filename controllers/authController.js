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
        phone: portalUserExists.phone,
        location: portalUserExists.location,
        gender: portalUserExists.gender,
        language: portalUserExists.language,
        dob: portalUserExists.dob,
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

exports.editProfie = async (req, res) => {
  try {
    const { email, phone, location, gender, language, dob, id } = req.body
    if (id == '') {
      return res.status(201).json({
        success: false,
        message: 'User ID missing...',
        error: 'error',
      })
    }
    // const registerAdminPortalUser = await PortalUser.registerAdminPortalUser(name,email,password);
    await User1.editUserbyID(email, phone, location, gender, language, dob, id)
      .then((data) => {
        console.log('Data: >>>>>', data)
        return res.status(201).json({
          success: true,
          message: 'Portal User Updated Successfully...',
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
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.updatepassword = async (req, res) => {
  try {
    const { password, confirmpassword, id } = req.body
    if (id == '') {
      return res.status(201).json({
        success: false,
        message: 'User ID missing...',
        error: 'error',
      })
    }

    if (password !== confirmpassword) {
      return res.status(403).json({
        success: false,
        message: 'Password does not match',
        error: 'Password error',
      })
    }
    const salt = await bcrypt.genSalt(10)
    const encryptPassword = await bcrypt.hash(password, salt)

    await User1.updateUserPassword(encryptPassword, id)
      .then((data) => {
        console.log('Data: >>>>>', data)
        return res.status(201).json({
          success: true,
          message: 'Password Updated Successfully...',
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
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.recoverPassword = async (req, res) => {
  console.log('recoverPassword')
  const { email } = req.body
  const user = await User1.getUserByEmail(email)
  if (user === undefined) {
    console.log('!user')
    return res.status(401).json({
      message: 'Invalid Email or Password',
    })
  }
  const code = generateCode()
  const resetExists = await User1.getResetByEmail(email)
  const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
  \n\n Your verification status is ${code}:\n\n
  \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
  </p>`
  await generateEmail(email, 'Friendly Forces - Password Reset', html)

  if (resetExists === undefined) {
    await User1.createReset(code, email)
      .then((data) => {
        console.log('Data: >>>>>', data)
        return res.status(200).json({
          success: true,

          message:
            'Recovery status Has Been Emailed To Your Registered Email Address',
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
  } else {
    await User1.updateReset(code, email)
      .then((data) => {
        console.log('Data: >>>>>', data)
        return res.status(200).json({
          success: true,

          message:
            'Recovery status Has Been Emailed To Your Registered Email Address',
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
  }
}

exports.verifyResetCode = async (req, res) => {
  const { code, email } = req.body
  if (email == '') {
    return res.status(403).json({
      success: false,
      message: 'User Email missing...',
      error: 'error',
    })
  }

  const codeverify = await User1.verifyCode(code, email)

  if (codeverify === undefined)
    return res.status(200).json({ message: 'Recovery status Accepted' })
  else {
    return res.status(400).json({ message: 'Invalid Code' })
  }
}

exports.forgotpassword = async (req, res) => {
  try {
    const { password, confirmpassword, email } = req.body
    if (email == '') {
      return res.status(403).json({
        success: false,
        message: 'User Email missing...',
        error: 'error',
      })
    }

    if (password !== confirmpassword) {
      return res.status(402).json({
        success: false,
        message: 'Password does not match',
        error: 'Password error',
      })
    }
    const salt = await bcrypt.genSalt(10)
    const encryptPassword = await bcrypt.hash(password, salt)

    await User1.resetUserPassword(encryptPassword, email)
      .then((data) => {
        console.log('Data: >>>>>', data)
        return res.status(201).json({
          success: true,
          message: 'Password Updated Successfully...',
          error: 'no error',
        })
      })
      .catch((error) => {
        console.log('Error: >>>>>', error.message)
        return res.status(405).json({
          success: false,
          message: error.message,
          error: error.message,
        })
      })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
