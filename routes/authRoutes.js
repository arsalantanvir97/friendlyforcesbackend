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
  getAllRecruiters,
  addRecruiter,
  updateRecruiterStatusbyid,
  getRecruiterbyid,
} = require('../controllers/authController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/registerAdminPortalUser', registerAdminPortalUser)
router.post('/authUser', authUser)
router.get('/getUserDetails/:id', getUserById)
router.get('/getRecruiterbyid/:id', getRecruiterbyid)
router.get('/getAllRecruiters', getAllRecruiters)

router.post('/addRecruiter', protect, addRecruiter)

router.post('/editProfie', protect, editProfie)
router.post('/editRecruiterDetails', protect, editProfie)

router.get('/updateRecruiterStatusbyid/:id', protect, updateRecruiterStatusbyid)

router.post('/updatepassword', updatepassword)
router.post('/recoverPassword', recoverPassword)
router.post('/verifyResetCode', verifyResetCode)
router.post('/forgotpassword', forgotpassword)

module.exports = router
