const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// إعداد الاعدادات الأساسية
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '7253MHG7253mhg@!',
    database: 'ViolationDB'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database!');
    }
});

// MiddleWare function
function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.sendStatus(403);
        }
        console.log('User from token:', user);  
        req.user = user;
        next();
    });
}

module.exports = { app, authenticateToken };

// تسجيل المسارات
const violationsRoute = require('./routes/violations');
const userViolationsRoute = require('./routes/UserViolation'); // استيراد المسار الجديد
const usersRoute = require('./routes/users');
app.use('/api/violations', violationsRoute);
app.use('/api/user-violations', userViolationsRoute); // تسجيل المسار الجديد
app.use('/api/users', usersRoute);

// مسارات المصادقة
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error Registering User:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).send('User Registered');
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error Fetching User:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid Credentials');
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({ userId: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
            req.session.token = token; // تخزين التوكن في الجلسة
            res.json({ token });
        } else {
            res.status(401).send('Invalid Credentials');
        }
    });
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM admins WHERE username = ?';

    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Incorrect password');
        }

        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Get My info endpoint
app.get('/api/users/me', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT username, id FROM users WHERE id = ?';

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

// Get Admin info endpoint
app.get('/api/admins/info', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT username, id FROM admins WHERE id = ?';

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
