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
