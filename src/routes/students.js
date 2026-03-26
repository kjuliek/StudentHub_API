const express = require('express');
const router = express.Router();
const { students } = require('../data/students');
const { validateStudent, createStudent, updateStudent, deleteStudent, getStats, searchStudents, getStudents, sortArray, VALID_SORT_FIELDS } = require('../services/students');

// GET /students — list all students with optional pagination and sort
router.get('/', (req, res) => {
  const { page, limit, sort, order = 'asc' } = req.query;

  if (sort !== undefined && !VALID_SORT_FIELDS.includes(sort))
    return res.status(400).json({ error: `sort must be one of: ${VALID_SORT_FIELDS.join(', ')}` });

  if (order !== 'asc' && order !== 'desc')
    return res.status(400).json({ error: 'order must be asc or desc' });

  if (page !== undefined || limit !== undefined) {
    const p = parseInt(page ?? 1);
    const l = parseInt(limit ?? 10);
    if (isNaN(p) || isNaN(l) || p < 1 || l < 1) return res.status(400).json({ error: 'page and limit must be positive integers' });
    return res.json(getStudents(p, l, sort, order));
  }

  res.json(sort ? sortArray(students, sort, order) : students);
});

// GET /students/stats — get statistics
router.get('/stats', (_req, res) => {
  res.json(getStats());
});

// GET /students/search?q= — search by name with optional pagination and sort
router.get('/search', (req, res) => {
  const { q, page, limit, sort, order = 'asc' } = req.query;
  if (!q || q.trim() === '') return res.status(400).json({ error: 'Query parameter q is required' });

  if (sort !== undefined && !VALID_SORT_FIELDS.includes(sort))
    return res.status(400).json({ error: `sort must be one of: ${VALID_SORT_FIELDS.join(', ')}` });

  if (order !== 'asc' && order !== 'desc')
    return res.status(400).json({ error: 'order must be asc or desc' });

  if (page !== undefined || limit !== undefined) {
    const p = parseInt(page ?? 1);
    const l = parseInt(limit ?? 10);
    if (isNaN(p) || isNaN(l) || p < 1 || l < 1) return res.status(400).json({ error: 'page and limit must be positive integers' });
    return res.json(searchStudents(q, p, l, sort, order));
  }

  res.json(searchStudents(q, null, null, sort, order));
});

// POST /students — create a student
router.post('/', (req, res) => {
  const validation = validateStudent(req.body);
  if (!validation.valid) {
    if (validation.conflict) return res.status(409).json({ error: validation.conflict });
    return res.status(400).json({ errors: validation.errors });
  }
  const student = createStudent(req.body);
  res.status(201).json(student);
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
