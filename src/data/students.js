const initialStudents = [
  { id: 1, firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@email.com', grade: 18, field: 'informatique' },
  { id: 2, firstName: 'Bob', lastName: 'Dupont', email: 'bob.dupont@email.com', grade: 12, field: 'mathématiques' },
  { id: 3, firstName: 'Clara', lastName: 'Bernard', email: 'clara.bernard@email.com', grade: 15, field: 'physique' },
  { id: 4, firstName: 'David', lastName: 'Leroy', email: 'david.leroy@email.com', grade: 9, field: 'chimie' },
  { id: 5, firstName: 'Emma', lastName: 'Petit', email: 'emma.petit@email.com', grade: 17, field: 'informatique' },
];

let students = [...initialStudents];

const resetStudents = () => {
  students.splice(0, students.length, ...initialStudents.map(s => ({ ...s })));
};

module.exports = { students, resetStudents };
