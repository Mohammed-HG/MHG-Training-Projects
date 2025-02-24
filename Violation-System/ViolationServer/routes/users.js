const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
  const query = 'SELECT id, username FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Internal server error');
      return;
    }
    res.status(200).json(results);
  });
});

module.exports = router;
