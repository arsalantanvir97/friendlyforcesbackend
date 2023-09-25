const express = require('express')
const router = express.Router()
const {
  registerAdminPortalUser,
  authUser,
  getUserById,
  editProfie,
  updatepassword,
} = require('../controllers/authController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/registerAdminPortalUser', registerAdminPortalUser)
router.post('/authUser', authUser)
router.get('/getUserDetails/:id', getUserById)
router.post('/editProfie', protect, editProfie)
router.post('/updatepassword', updatepassword)

module.exports = router
