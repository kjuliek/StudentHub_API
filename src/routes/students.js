const express = require('express');
const router = express.Router();
const { students } = require('../data/students');
const { validateStudent, createStudent, updateStudent, deleteStudent, getStats, searchStudents } = require('../services/students');

// GET /students — list all students
router.get('/', (req, res) => {
  res.json(students);
});

// GET /students/stats — get statistics
router.get('/stats', (_req, res) => {
  res.json(getStats());
});

// GET /students/search?q= — search by name
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') return res.status(400).json({ error: 'Query parameter q is required' });
  res.json(searchStudents(q));
});

// POST /students — create a student
router.post('/', (req, res) => {
  const validation = validateStudent(req.body);
  if (!validation.valid) {
    if (validation.conflict) return res.status(409).json({ error: validation.conflict });
    return res.status(400).json({ errors: validation.errors });
  }
  const student = createStudent(req.body);
  res.status(200).json(student);
});

// GET /students/:id — get one student
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID must be a valid number' });

  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// PUT /students/:id — update a student
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID must be a valid number' });

  const existing = students.find(s => s.id === id);
  if (!existing) return res.status(404).json({ error: 'Student not found' });

  const validation = validateStudent(req.body, id);
  if (!validation.valid) {
    if (validation.conflict) return res.status(409).json({ error: validation.conflict });
    return res.status(400).json({ errors: validation.errors });
  }

  const updated = updateStudent(id, req.body);
  res.json(updated);
});

// DELETE /students/:id — delete a student
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID must be a valid number' });

  const deleted = deleteStudent(id);
  if (!deleted) return res.status(404).json({ error: 'Student not found' });

  res.json({ message: `Student ${id} deleted successfully` });
});

module.exports = router;
