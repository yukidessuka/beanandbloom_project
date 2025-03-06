const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // นำเข้า userController

// เส้นทางสำหรับการเข้าสู่ระบบ (Login)
router.post('/login', userController.login);

// เส้นทางสำหรับการสมัครสมาชิก (Sign Up)
router.post('/signup', userController.signup);

module.exports = router;
