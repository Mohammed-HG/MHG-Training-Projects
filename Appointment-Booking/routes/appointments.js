const express = require('express');
const router = express.Router();
const pool = require('../db');

// إضافة موعد جديد
router.post('/', async (req, res) => {
  const { name, date, reason } = req.body;
  const query = 'INSERT INTO appointments (name, date, reason) VALUES (?, ?, ?)';
  try {
    const [result] = await pool.execute(query, [name, date, reason]);
    res.status(201).json({
      id: result.insertId,
      name,
      date,
      reason,
      status: 'Pending'
    });
  } catch (error) {
    console.error(' خطأ في إضافة الموعد:', error);
    res.status(500).json({ message: 'فشل في إضافة الموعد' });
  }
});

// الحصول على جميع المواعيد (للمسؤول)
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM appointments';
  try {
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error(' خطأ في جلب المواعيد:', error);
    res.status(500).json({ message: 'فشل في جلب المواعيد' });
  }
});

// تحديث حالة الموعد وإضافة ملاحظات المسؤول
router.put('/:id', async (req, res) => {
  const { status, adminNotes } = req.body;
  const { id } = req.params;
  const query = 'UPDATE appointments SET status = ?, adminNotes = ? WHERE id = ?';
  try {
    const [result] = await pool.execute(query, [status, adminNotes, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'الموعد غير موجود' });
    }
    res.json({ message: 'تم تحديث الموعد بنجاح' });
  } catch (error) {
    console.error('خطأ في تحديث الموعد:', error);
    res.status(500).json({ message: 'فشل في تحديث الموعد' });
  }
});

module.exports = router;
