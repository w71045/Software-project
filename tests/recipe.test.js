const request = require('supertest');
const app = require('../app');
const db = require('../models/db'); // assuming you export your PG pool here

describe('Recipe API', () => {
  let token;

  beforeAll(async () => {
    // Generate unique email to avoid conflicts
    const email = `ruser${Date.now()}@example.com`;

    // Register user
    await request(app)
      .post('/users/register')
      .send({ username: 'RUser', email, password: 'pass123' });

    // Login user
    const login = await request(app)
      .post('/users/login')
      .send({ email, password: 'pass123' });

    token = login.body.token;
  });

  test('creates a recipe', async () => {
    const res = await request(app)
      .post('/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Salad',
        description: 'Fresh',
        ingredients: ['Lettuce', 'Tomato']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Salad');
  });

  test('gets recipes', async () => {
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await db.end(); // Close DB connection to stop Jest hanging
  });
});
