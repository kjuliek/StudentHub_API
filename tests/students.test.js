const request = require('supertest');
const app = require('../src/app');
const { resetStudents } = require('../src/data/students');

beforeEach(() => {
  resetStudents();
});

// ─── GET /students ───────────────────────────────────────────────────────────

describe('GET /students', () => {
  it('should return 200 and an array', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return all initial students', async () => {
    const res = await request(app).get('/students');
    expect(res.body).toHaveLength(5);
  });
});

// ─── GET /students?page&limit ─────────────────────────────────────────────────

describe('GET /students with pagination', () => {
  it('should return paginated data and pagination metadata', async () => {
    const res = await request(app).get('/students?page=1&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 2, total: 5, totalPages: 3 });
  });

  it('should return the correct second page', async () => {
    const res = await request(app).get('/students?page=2&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.page).toBe(2);
  });

  it('should return empty data for out-of-range page', async () => {
    const res = await request(app).get('/students?page=999&limit=10');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('should return 400 for invalid page value', async () => {
    const res = await request(app).get('/students?page=0&limit=10');
    expect(res.statusCode).toBe(400);
  });
});

// ─── GET /students/:id ───────────────────────────────────────────────────────

describe('GET /students/:id', () => {
  it('should return the correct student for a valid ID', async () => {
    const res = await request(app).get('/students/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('should return 404 for a non-existing ID', async () => {
    const res = await request(app).get('/students/999');
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for an invalid ID', async () => {
    const res = await request(app).get('/students/abc');
    expect(res.statusCode).toBe(400);
  });
});

// ─── POST /students ──────────────────────────────────────────────────────────

const validStudent = {
  firstName: 'Léa',
  lastName: 'Simon',
  email: 'lea.simon@email.com',
  grade: 14,
  field: 'physique',
};

describe('POST /students', () => {
  it('should return 201 and the created student with an ID', async () => {
    const res = await request(app).post('/students').send(validStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(validStudent.email);
  });

  it('should return 400 when a required field is missing', async () => {
    const { email: _email, ...withoutEmail } = validStudent;
    const res = await request(app).post('/students').send(withoutEmail);
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for an invalid grade', async () => {
    const res = await request(app).post('/students').send({ ...validStudent, grade: 25 });
    expect(res.statusCode).toBe(400);
  });

  it('should return 409 for a duplicate email', async () => {
    const res = await request(app).post('/students').send({ ...validStudent, email: 'alice.martin@email.com' });
    expect(res.statusCode).toBe(409);
  });
});

// ─── PUT /students/:id ───────────────────────────────────────────────────────

describe('PUT /students/:id', () => {
  it('should return 200 and the updated student', async () => {
    const res = await request(app).put('/students/1').send({ ...validStudent, email: 'alice.martin@email.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.grade).toBe(validStudent.grade);
  });

  it('should return 404 for a non-existing ID', async () => {
    const res = await request(app).put('/students/999').send(validStudent);
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid data on PUT', async () => {
    const res = await request(app).put('/students/1').send({ ...validStudent, email: 'alice.martin@email.com', grade: 99 });
    expect(res.statusCode).toBe(400);
  });

  it('should return 409 for duplicate email on PUT', async () => {
    const res = await request(app).put('/students/1').send({ ...validStudent, email: 'bob.dupont@email.com' });
    expect(res.statusCode).toBe(409);
  });
});

// ─── DELETE /students/:id ────────────────────────────────────────────────────

describe('DELETE /students/:id', () => {
  it('should return 200 for a valid ID', async () => {
    const res = await request(app).delete('/students/1');
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 for a non-existing ID', async () => {
    const res = await request(app).delete('/students/999');
    expect(res.statusCode).toBe(404);
  });
});

// ─── GET /students/stats ─────────────────────────────────────────────────────

describe('GET /students/stats', () => {
  it('should return totalStudents, averageGrade, studentsByField, bestStudent', async () => {
    const res = await request(app).get('/students/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalStudents');
    expect(res.body).toHaveProperty('averageGrade');
    expect(res.body).toHaveProperty('studentsByField');
    expect(res.body).toHaveProperty('bestStudent');
  });
});

// ─── GET /students/search ────────────────────────────────────────────────────

describe('GET /students/search', () => {
  it('should return matching students by name', async () => {
    const res = await request(app).get('/students/search?q=alice');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].firstName.toLowerCase()).toContain('alice');
  });
});

// ─── GET /students?sort ───────────────────────────────────────────────────────

describe('GET /students with sort', () => {
  it('should return students sorted by grade descending', async () => {
    const res = await request(app).get('/students?sort=grade&order=desc');
    expect(res.statusCode).toBe(200);
    const grades = res.body.map(s => s.grade);
    expect(grades).toEqual([...grades].sort((a, b) => b - a));
  });

  it('should return students sorted by grade ascending', async () => {
    const res = await request(app).get('/students?sort=grade&order=asc');
    expect(res.statusCode).toBe(200);
    const grades = res.body.map(s => s.grade);
    expect(grades).toEqual([...grades].sort((a, b) => a - b));
  });

  it('should return 400 for an invalid sort field', async () => {
    const res = await request(app).get('/students?sort=invalid');
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for an invalid order value', async () => {
    const res = await request(app).get('/students?sort=grade&order=invalid');
    expect(res.statusCode).toBe(400);
  });

  it('should sort correctly when two students have equal values', async () => {
    const res = await request(app).get('/students?sort=field&order=asc');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── GET /students/search with sort & pagination ──────────────────────────────

describe('GET /students/search with sort and pagination', () => {
  it('should return 400 for invalid sort field on search', async () => {
    const res = await request(app).get('/students/search?q=alice&sort=invalid');
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid order on search', async () => {
    const res = await request(app).get('/students/search?q=alice&order=invalid');
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid page on search', async () => {
    const res = await request(app).get('/students/search?q=alice&page=0&limit=10');
    expect(res.statusCode).toBe(400);
  });

  it('should return paginated and sorted search results', async () => {
    const res = await request(app).get('/students/search?q=a&page=1&limit=2&sort=grade&order=desc');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });
});
