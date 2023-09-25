const express = require('express')
const router = express.Router()
const {
  registerAdminPortalUser,
  authUser,
  getUserById,
  editProfie,
  updatepassword,
  recoverPassword,
  verifyResetCode,
  forgotpassword,
} = require('../controllers/authController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/registerAdminPortalUser', registerAdminPortalUser)
router.post('/authUser', authUser)
router.get('/getUserDetails/:id', getUserById)
router.post('/editProfie', protect, editProfie)
router.post('/updatepassword', updatepassword)
router.post('/recoverPassword', recoverPassword)
router.post('/verifyResetCode', verifyResetCode)
router.post('/forgotpassword', forgotpassword)

module.exports = router
