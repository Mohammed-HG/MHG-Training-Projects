const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../ViolationServer'); 
/*const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticateToken;*/


// جلب جميع المخالفات مع البحث (للمدير)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  const { search } = req.query;
  let query = `
    SELECT
      violations.id AS violation_id,
      violations.date,
      violations.type,
      violations.number,
      violations.value,
      violations.description,
      users.id AS user_id,
      users.username AS user_name
    FROM
      violations
    JOIN
      users ON violations.userId = users.id
  `;

  if (search) {
    query += `
      WHERE
        violations.number LIKE '%${search}%' OR
        users.username LIKE '%${search}%' OR
        users.id LIKE '%${search}%'
    `;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching violations:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(200).json(results);
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { date, type, number, value, description, userId } = req.body;

  const query = 'INSERT INTO violations (date, type, number, value, userId, description) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [date, type, number, value, userId, description], (err, result) => {
    if (err) {
      console.error('Error inserting violation:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(201).send('Violation added successfully');
  });
});

router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { date, type, number, value, description } = req.body;
  const userId = req.user.userId; // الحصول على userId من التوكن المصادق عليه

  // تأكد من أن المستخدم يمكنه تحديث المخالفات الخاصة به فقط
  const query = 'UPDATE violations SET date = ?, type = ?, number = ?, value = ?, description = ? WHERE id = ? AND userId = ?';

  db.query(query, [date, type, number, value, description, id, userId], (err, result) => {
    if (err) {
      console.error('Error updating violation:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(200).send('Violation updated successfully');
  });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // الحصول على userId من التوكن المصادق عليه
  const query = 'DELETE FROM violations WHERE id = ? AND userId = ?';

  db.query(query, [id, userId], (err, result) => {
    if (err) {
      console.error('Error deleting violation:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(200).send('Violation deleted successfully');
  });
});

module.exports = router;
