const express = require('express')
const router = express.Router()
const {
  registerAdminPortalUser,
  authUser,
  getUserById,
} = require('../controllers/authController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/registerAdminPortalUser', registerAdminPortalUser)
router.post('/authUser', authUser)
router.get('/getUserDetails/:id', getUserById)

module.exports = router
