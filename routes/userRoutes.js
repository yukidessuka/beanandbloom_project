const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // สำหรับการเข้ารหัสรหัสผ่าน

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body; // รับข้อมูลจากฟอร์ม

    console.log("Received data:", req.body);  // ดูข้อมูลที่ได้รับจากฟอร์ม

    try {
        // ตรวจสอบว่าอีเมลนี้มีการใช้งานแล้วหรือไม่
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }

        // เข้ารหัสรหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // สร้างผู้ใช้ใหม่
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        console.log("Created User:", newUser);  // พิมพ์ข้อมูลของผู้ใช้ที่ถูกสร้าง

        // บันทึกผู้ใช้ลงใน MongoDB
        await newUser.save();

        // Redirect ไปหน้า login
        res.redirect('/login');
    } catch (err) {
        console.error("Error saving user:", err);  // แสดงข้อผิดพลาดใน console
        res.status(500).send('Server Error');
    }
});

module.exports = router;
