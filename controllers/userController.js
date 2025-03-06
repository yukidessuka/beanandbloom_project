const User = require('../models/User');
const bcrypt = require('bcryptjs'); // สำหรับการเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken'); // สำหรับการสร้าง JSON Web Toke

// ฟังก์ชันสำหรับการสมัครสมาชิก (Sign Up)
exports.signup = async (req, res) => {
    const { username, email, password } = req.body; // รับข้อมูลจากฟอร์ม

    console.log("Received data:", req.body); // ดูข้อมูลที่ได้รับจากฟอร์ม

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

        console.log("Created User:", newUser); // พิมพ์ข้อมูลของผู้ใช้ที่ถูกสร้าง

        // บันทึกผู้ใช้ลงใน MongoDB
        await newUser.save();

        // Redirect ไปหน้า login
        res.redirect('/login');
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ค้นหาผู้ใช้จากอีเมล
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // เปรียบเทียบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // สร้าง JWT และส่งข้อมูล
        const payload = { userId: user._id };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

        // เปลี่ยนเส้นทางไปที่หน้า home
        res.redirect('/home'); // เปลี่ยนเส้นทางไปหน้า home แทน dashboard
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


