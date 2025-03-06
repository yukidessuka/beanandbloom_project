const express = require('express');
const router = express.Router();
const User = require('../models/user');  // นำเข้า User model
const bcrypt = require('bcryptjs'); // สำหรับการเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken'); // สำหรับการสร้าง JSON Web Token

// Route สำหรับสมัครสมาชิก
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;  // รับค่าจากฟอร์ม

    try {
        // ตรวจสอบว่าอีเมลนี้มีการใช้งานแล้วหรือไม่
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }

        // เข้ารหัสรหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // สร้าง user ใหม่
        const newUser = new User({
            username,
            email,
            password: hashedPassword // เก็บรหัสผ่านที่ถูกเข้ารหัสแล้ว
        });

        // บันทึกข้อมูล user ใหม่ลงใน MongoDB
        await newUser.save();

        // เมื่อสมัครเสร็จแล้ว redirect ไปที่หน้า login
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route สำหรับเข้าสู่ระบบ (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูลตามอีเมล
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // ตรวจสอบรหัสผ่านที่กรอกกับรหัสผ่านที่เก็บไว้ในฐานข้อมูล
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // สร้าง JSON Web Token (JWT) สำหรับผู้ใช้
        const payload = { userId: user._id };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

        // ส่ง token กลับไป
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
