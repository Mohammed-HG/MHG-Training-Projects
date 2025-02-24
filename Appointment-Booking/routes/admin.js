// routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// سر التوكن (يجب تخزينه بشكل آمن)
const JWT_SECRET = 'secret_key';

// تسجيل دخول المسؤول
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM admins WHERE username = ?';
  try {
    const [rows] = await pool.execute(query, [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(' خطأ في تسجيل الدخول:', error);
    res.status(500).json({ message: 'فشل في تسجيل الدخول' });
  }
});

module.exports = router;
