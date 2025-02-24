const express = require('express');
const mysql = require('mysql'); // استخدم mysql
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3600;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// إنشاء اتصال بقاعدة البيانات باستخدام pool
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '7253MHG7253mhg@!',
    database: 'appointmentdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('تم إعداد اتصال قاعدة البيانات!');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware للتحقق من التوكن
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'توكن مفقود' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'توكن غير صالح' });
        req.user = user;
        next();
    });
};

// تسجيل مستخدم جديد
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const checkUserSql = 'SELECT * FROM users WHERE UserName = ?';
        db.query(checkUserSql, [username], async (err, results) => {
            if (err) return res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
            if (results.length > 0) return res.status(400).json({ error: 'اسم المستخدم موجود بالفعل' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO users (UserName, UserPass) VALUES (?, ?)';
            db.query(sql, [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
                res.status(201).json({ message: 'تم تسجيل المستخدم بنجاح' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
    }
});

// تسجيل الدخول
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE UserName = ?';
    try {
        db.query(sql, [username], async (err, results) => {
            if (err) return res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
            if (results.length === 0) return res.status(401).json({ error: 'بيانات الاعتماد غير صحيحة' });

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.UserPass);
            if (!isPasswordValid) return res.status(401).json({ error: 'بيانات الاعتماد غير صحيحة' });

            const token = jwt.sign(
                { userId: user.UserId, username: user.UserName, isAdmin: user.isAdmin },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ token, isAdmin: user.isAdmin });
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
    }
});

// Get My info endpoint
router.get('/api/users/me', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT UserName, UserId FROM users WHERE UserId = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User Not Found' });
        }
    });
});
app.use(router);

// إضافة موعد جديد
router.post('/api/appointments', authenticateToken, (req, res) => {
  const { name, date, reason } = req.body;
  const userId = req.user.userId;
  const query = 'INSERT INTO appointments (name, date, reason, userId) VALUES (?, ?, ?, ?)';
  try {
    db.query(query, [name, date, reason, userId], (err, result) => {
        if (err) {
            console.error(' خطأ في إضافة الموعد:', err);
            return res.status(500).json({ message: 'فشل في إضافة الموعد' });
        }
        res.status(201).json({
            id: result.insertId,
            name,
            date,
            reason,
            status: 'Pending'
        });
    });
  } catch (error) {
    console.error(' خطأ في إضافة الموعد:', error);
    res.status(500).json({ message: 'فشل في إضافة الموعد' });
  }
});

// الحصول على جميع المواعيد (للمسؤول)
router.get('/api/appointments', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM appointments';
  try {
    db.query(query, (err, rows) => {
        if (err) {
            console.error(' خطأ في جلب المواعيد:', err);
            return res.status(500).json({ message: 'فشل في جلب المواعيد' });
        }
        res.json(rows);
    });
  } catch (error) {
    console.error(' خطأ في جلب المواعيد:', error);
    res.status(500).json({ message: 'فشل في جلب المواعيد' });
  }
});

// الحصول على مواعيد المستخدم الحالي
router.get('/api/user-appointments', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const query = 'SELECT * FROM appointments WHERE userId = ?';
    try {
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching appointments:', err);
                return res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
    }
});

// DELETE endpoint to remove an appointment by ID
app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM appointments WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting appointment:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the appointment' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    });
});

// تحديث حالة الموعد وإضافة ملاحظات المسؤول
router.put('/api/appointments/:id', authenticateToken, (req, res) => {
  const { status, adminNotes } = req.body;
  const { id } = req.params;
  const query = 'UPDATE appointments SET status = ?, adminNotes = ? WHERE id = ?';
  try {
    db.query(query, [status, adminNotes, id], (err, result) => {
        if (err) {
            console.error('خطأ في تحديث الموعد:', err);
            return res.status(500).json({ message: 'فشل في تحديث الموعد' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'الموعد غير موجود' });
        }
        res.json({ message: 'تم تحديث الموعد بنجاح' });
    });
  } catch (error) {
    console.error('خطأ في تحديث الموعد:', error);
    res.status(500).json({ message: 'فشل في تحديث الموعد' });
  }
});

app.use(router); // استخدام router

// بدء الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
