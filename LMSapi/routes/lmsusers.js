const express = require('express')

const userController = require('../controllers/users.js')
const resetPasswordController = require('../controllers/resetpassword.js')
const router = express.Router()
const Authonticate = require('../middlewares/auth.js')
router.post('/login',userController.userLogin)
router.post('/mentorregister',userController.mentorRegister)
router.post('/employeeregister',userController.employeeRegister)
router.get('/mentorslist',userController.getMentor)
router.put('/mentoredit',userController.mentorEdit)
router.delete('/mentordelete',userController.mentorDelete) 
router.put('/resetpassword',resetPasswordController.resetPassword)
router.put('/empregisterapprove',userController.employeeRegisterApprove)
router.put('/empregisterreject',userController.employeeRegisterReject)
router.delete('/deleteemployee',userController.employeeDelete)
router.put('/employeeedit',userController.employeeEdit)
router.get('/allemployees',userController.getAllEmployees)
router.get('/getemployeebyid',userController.getEmployeeDetailsBasedOnEmpId)
router.get('/getskills',userController.getSkills)
router.get('/getemployeebybatchid',userController.getEmployeeDetailsBasedOnBatchId)

module.exports = router
