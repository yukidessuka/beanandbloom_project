const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// ตั้งค่า EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ใช้ body-parser ในการรับข้อมูลจาก form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ตั้งค่า API routes สำหรับ user
app.use('/api/users', userRoutes);

// หน้า login และ signup
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

mongoose.connect('mongodb+srv://yukieiei:yukilove123@cluster0.vl89a.mongodb.net/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
