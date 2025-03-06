const mongoose = require('mongoose');

// สร้าง Schema สำหรับ User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // ให้ username ต้องไม่ซ้ำ
    },
    email: {
        type: String,
        required: true,
        unique: true,  // ให้ email ต้องไม่ซ้ำ
    },
    password: {
        type: String,
        required: true,
    }
});

// สร้าง Model จาก Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
