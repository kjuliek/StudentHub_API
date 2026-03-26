const express = require('express');
const router = express.Router();
const { students } = require('../data/students');

// GET /students — list all students
router.get('/', (req, res) => {
  res.json(students);
});

// GET /students/:id — get one student
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

module.exports = router;
