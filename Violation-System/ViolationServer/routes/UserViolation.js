const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../ViolationServer'); // استيراد وظيفة authenticateToken

// جلب المخالفات بناءً على userId المصادق عليه (للمستخدمين)
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId; // الحصول على userId من التوكن المصادق عليه
  const query = `
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
    WHERE violations.userId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching violations for user:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(200).json(results);
  });
});

module.exports = router;
