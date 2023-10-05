const express = require('express')
const router = express.Router()
const {
  submitForm,
  submitFormbyRecruiter,
  getAllGetHiredForms,
  getFormDetails,
  deleteHired,
  getAllGetHiredFormsbyRecruiterid,
} = require('../controllers/getHiredController')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/submitForm', submitForm)
router.post('/submitFormbyRecruiter', protect, submitFormbyRecruiter)

router.get('/getAllGetHiredForms', getAllGetHiredForms)
router.get(
  '/getAllGetHiredFormsbyRecruiterid/:id',
  getAllGetHiredFormsbyRecruiterid
)

router.get('/getFormDetails/:id', getFormDetails)
router.post('/deleteHired', deleteHired)

module.exports = router
