const express = require('express')
const router = express.Router()
const {
  submitForm,
  getAllGetHiredForms,
  getFormDetails,
} = require('../controllers/getHiredController')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/submitForm', submitForm)
router.get('/getAllGetHiredForms', getAllGetHiredForms)
router.get('/getFormDetails/:id', getFormDetails)

module.exports = router
