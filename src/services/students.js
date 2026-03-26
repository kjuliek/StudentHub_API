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

module.exports = { validateStudent, createStudent };
