const { students } = require('../data/students');

const VALID_FIELDS = ['informatique', 'mathématiques', 'physique', 'chimie'];

function validateStudent(data, excludeId = null) {
  const { firstName, lastName, email, grade, field } = data;
  const errors = [];

  if (!firstName || firstName.length < 2) errors.push('firstName must be at least 2 characters');
  if (!lastName || lastName.length < 2) errors.push('lastName must be at least 2 characters');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email must be valid');
  if (grade === undefined || grade < 0 || grade > 20) errors.push('grade must be between 0 and 20');
  if (!field || !VALID_FIELDS.includes(field)) errors.push('field must be one of: ' + VALID_FIELDS.join(', '));

  if (errors.length) return { valid: false, errors };

  const emailTaken = students.find(s => s.email === email && s.id !== excludeId);
  if (emailTaken) return { valid: false, conflict: 'email already in use' };

  return { valid: true };
}

function createStudent(data) {
  const { firstName, lastName, email, grade, field } = data;
  const newStudent = {
    id: students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
    firstName,
    lastName,
    email,
    grade,
    field,
  };
  students.push(newStudent);
  return newStudent;
}

function updateStudent(id, data) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;
  students[index] = { ...students[index], ...data };
  return students[index];
}

function deleteStudent(id) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  return true;
}

function getStats() {
  const total = students.length;
  const averageGrade = total
    ? Math.round((students.reduce((sum, s) => sum + s.grade, 0) / total) * 100) / 100
    : 0;

  const studentsByField = students.reduce((acc, s) => {
    acc[s.field] = (acc[s.field] || 0) + 1;
    return acc;
  }, {});

  const bestStudent = students.reduce((best, s) => (!best || s.grade > best.grade ? s : best), null);

  return { totalStudents: total, averageGrade, studentsByField, bestStudent };
}

const VALID_SORT_FIELDS = ['id', 'firstName', 'lastName', 'email', 'grade', 'field'];

function sortArray(array, sort, order) {
  return [...array].sort((a, b) => {
    if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
    if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

function paginate(array, page, limit) {
  const start = (page - 1) * limit;
  return {
    data: array.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
    },
  };
}

function searchStudents(query, page = null, limit = null, sort = null, order = 'asc') {
  const q = query.toLowerCase();
  let results = students.filter(s =>
    s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q)
  );
  if (sort) results = sortArray(results, sort, order);
  return page && limit ? paginate(results, page, limit) : results;
}

function getStudents(page, limit, sort = null, order = 'asc') {
  const list = sort ? sortArray(students, sort, order) : [...students];
  return paginate(list, page, limit);
}

module.exports = { validateStudent, createStudent, updateStudent, deleteStudent, getStats, searchStudents, getStudents, sortArray, VALID_SORT_FIELDS };
