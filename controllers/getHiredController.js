const Gethired = require('../models/GethiredModel')

exports.submitForm = async (req, res) => {
  try {
    const {
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
    } = req.body
    // let resume =
    //   req.files && req.files.doc && req.files.doc[0] && req.files.doc[0].path

    await Gethired.createGetHired(
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
    )
      .then((data) => {
        //console.log("Data: >>>>>", data)
        return res.status(200).json({
          success: true,
          message: 'Form Submitted Successfully...',
          error: 'no error',
        })
      })
      .catch((error) => {
        //console.log("Error: >>>>>", error.message)
        return res.status(400).json({
          success: false,
          message: error.message,
          error: error.message,
        })
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

exports.submitFormbyRecruiter = async (req, res) => {
  try {
    const {
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
    } = req.body
    // let resume =
    //   req.files && req.files.doc && req.files.doc[0] && req.files.doc[0].path

    await Gethired.createGetHiredbyRecruiter(
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
    )
      .then((data) => {
        //console.log("Data: >>>>>", data)
        return res.status(200).json({
          success: true,
          message: 'Form Submitted Successfully...',
          error: 'no error',
        })
      })
      .catch((error) => {
        //console.log("Error: >>>>>", error.message)
        return res.status(400).json({
          success: false,
          message: error.message,
          error: error.message,
        })
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

exports.getAllGetHiredForms = async (req, res) => {
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
      let query = 'SELECT * FROM gethiredform WHERE 1=1'

      // Add date filtering if provided
      //   if (req.query.from !== '') {
      //     query += ` AND created_at >= '${req.query.from}'`
      //   }

      //   if (req.query.to !== '') {
      //     query += ` AND created_at <= '${followingDay}'`
      //   }

      // Add search filtering if provided
      if (req.query.search !== '') {
        const searchColumns = ['email', 'country', 'name', 'phone', 'message'] // Add the columns you want to search
        const searchConditions = searchColumns
          .map((column) => `${column} LIKE '%${req.query.search}%'`)
          .join(' OR ')
        query += ` AND (${searchConditions})`
      }

      // Add sorting by date_column in descending order
      query += ' ORDER BY created_at DESC'

      // Count the total number of records
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count')
      const [countResult] = await Gethired.getAllHiredForm(countQuery)
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
        const gethired = await Gethired.getAllHiredForm(query)
        if (page < numPages) {
          res.status(200).json({
            success: true,
            message: 'data get successfully',
            result: gethired,
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

exports.getAllGetHiredFormsbyRecruiterid = async (req, res) => {
  const { id } = req.params

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
      let query = `SELECT * FROM gethiredform WHERE recuiterid = ${id}`

      // Add date filtering if provided
      //   if (req.query.from !== '') {
      //     query += ` AND created_at >= '${req.query.from}'`
      //   }

      //   if (req.query.to !== '') {
      //     query += ` AND created_at <= '${followingDay}'`
      //   }

      // Add search filtering if provided
      if (req.query.search !== '') {
        const searchColumns = ['email', 'country', 'name', 'phone', 'message'] // Add the columns you want to search
        const searchConditions = searchColumns
          .map((column) => `${column} LIKE '%${req.query.search}%'`)
          .join(' OR ')
        query += ` AND (${searchConditions})`
      }

      // Add sorting by date_column in descending order
      query += ' ORDER BY created_at DESC'

      // Count the total number of records
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count')
      const [countResult] = await Gethired.getAllHiredForm(countQuery)
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
        const gethired = await Gethired.getAllHiredForm(query)
        if (page < numPages) {
          res.status(200).json({
            success: true,
            message: 'data get successfully',
            result: gethired,
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

exports.getFormDetails = async (req, res) => {
  try {
    const { id } = req.params

    const user = await Gethired.getFormById(id)
    res.json(user)
  } catch (error) {
    console.error('Error', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
exports.deleteHired = async (req, res) => {
  try {
    const { id } = req.body

    const user = await Gethired.DeleteFormById(id)
    res.json({
      success: true,
      message: 'Hired form has been deleted successfull',
      error: 'no error',
    })
  } catch (error) {
    console.error('Error', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
