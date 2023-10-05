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
exports.addRecruiter = async (req, res) => {
  try {
    const { name, email, password, phone, location, gender, language, dob } =
      req.body
    let usertype = 'recruiter'
    const portalUserExists = await User1.getUserByEmail(email)
    console.log(portalUserExists)
    if (portalUserExists === undefined) {
      const salt = await bcrypt.genSalt(10)
      const encryptPassword = await bcrypt.hash(password, salt)

      // const registerAdminPortalUser = await PortalUser.registerAdminPortalUser(name,email,password);
      await User1.registerRecruiter(
        name,
        email,
        encryptPassword,
        usertype,
        phone,
        location,
        gender,
        language,
        dob
      )
        .then((data) => {
          console.log('Data: >>>>>', data)
          return res.status(200).json({
            success: true,
            message: 'Recruiter Added Successfully...',
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
exports.updateRecruiterStatusbyid = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User1.updateRecruiterStatus(id)
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

exports.getAllRecruiters = async (req, res) => {
  try {
    if (
      req.query.numPerPage === null ||
      req.query.numPerPage === undefined ||
      req.query.numPerPage === '' ||
      req.query.page === null ||
      req.query.page === undefined ||
      req.query.page === '' ||
      //   req.query.from === null ||
      //   req.query.from === undefined ||
      //   req.query.to === null ||
      //   req.query.to === undefined ||
      req.query.search === null ||
      req.query.search === undefined
    ) {
      res.status(200).json({
        success: false,
        message:
          'Plz Make Sure That All Fields are not undefined or null or Empty String',
        result: [],
        pagiantion: {},
        fields: {
          numPerPage:
            req.query.numPerPage === undefined
              ? 'undefined'
              : req.query.numPerPage,
          page: req.query.page === undefined ? 'undefined' : req.query.page,
          //   from: req.query.from === undefined ? 'undefined' : req.query.from,
          //   to: req.query.to === undefined ? 'undefined' : req.query.to,
          search:
            req.query.search === undefined ? 'undefined' : req.query.search,
        },
        error: 'error',
      })
    } else {
      //   var today = new Date()
      //   var dd = String(today.getDate()).padStart(2, '0')
      //   var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      //   var yyyy = today.getFullYear()

      //   const to = yyyy + '-' + mm + '-' + dd

      //   var current = new Date(req.query.to === '' ? to : req.query.to)
      //   var followingDay = new Date(current.getTime() + 86400000).toISOString() // + 1 day in ms

      //   console.log(req.query.from)
      //   console.log('followingDay >>>> ', followingDay)

      //---------------------------------------------------------------------

      // Calculate the offset for pagination
      const offset = parseInt(req.query.page) * parseInt(req.query.numPerPage)

      // Prepare the MySQL query
      // let query = 'SELECT * FROM user WHERE 1=1 AND usertype = recruiter'
      let query = 'SELECT * FROM user WHERE usertype = "recruiter"'

      // Add date filtering if provided
      //   if (req.query.from !== '') {
      //     query += ` AND created_at >= '${req.query.from}'`
      //   }

      //   if (req.query.to !== '') {
      //     query += ` AND created_at <= '${followingDay}'`
      //   }

      // Add search filtering if provided
      if (req.query.search !== '') {
        const searchColumns = ['email', 'location', 'name', 'phone'] // Add the columns you want to search
        const searchConditions = searchColumns
          .map((column) => `${column} LIKE '%${req.query.search}%'`)
          .join(' OR ')
        query += ` AND (${searchConditions})`
      }

      // Add sorting by date_column in descending order
      query += ' ORDER BY created_at DESC'

      // Count the total number of records
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count')
      const [countResult] = await User1.gettingAllRecruiters(countQuery)
      console.log('count>>', countResult)
      const totalCount = countResult.count

      // Add pagination
      query += ` LIMIT ${req.query.numPerPage} OFFSET ${offset}`

      const numPerPage = parseInt(req.query.numPerPage)
      var page = parseInt(req.query.page)
      var numPages
      // var skip = page * numPerPage
      var limit = numPerPage

      // numRows = await Invoice.countDocuments(where);
      // console.log(numRows)

      // numRows = await Brand.count()
      if (totalCount > 0) {
        numPages = Math.ceil(totalCount / numPerPage)

        // var results = await Brand.find().limit(limit).skip(skip)
        // var results = await Invoice.find(where, 'invoiceId client totalAmount currency createdAt unit paid status leadSource leadAddedBy paidAtDateTime').skip(skip).limit(limit).sort({ createdAt: -1 });
        const recruites = await User1.gettingAllRecruiters(query)
        if (page < numPages) {
          res.status(200).json({
            success: true,
            message: 'data get successfully',
            result: recruites,
            pagiantion: {
              error: 'none',
              current: page,
              dataCount: totalCount,
              pages: numPages,
              perPage: numPerPage,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            },
          })
        } else {
          res.status(200).json({
            success: false,
            message:
              'queried page ' +
              page +
              ' is >= to maximum page number ' +
              numPages,
            result: [],
            pagiantion: {
              error:
                'queried page ' +
                page +
                ' is >= to maximum page number ' +
                numPages,
            },
          })
        }
      } else {
        res.status(200).json({
          success: false,
          message:
            'queried page ' +
            page +
            ' is >= to maximum page number ' +
            numPages,
          result: [],
          pagiantion: {
            error:
              'queried page ' +
              page +
              ' is >= to maximum page number ' +
              numPages,
          },
        })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Something Went Wrong in Server',
      result: [],
      pagiantion: {},
      error: error.message,
    })
  }
}
