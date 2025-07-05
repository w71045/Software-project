const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  test('registers a user', async () => {
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'TestUser',
        email: uniqueEmail,
        password: '123456' // Valid length for your validator
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'TestUser');
  });

  test('logs in a user', async () => {
    const uniqueEmail = `testlogin${Date.now()}@example.com`;

    // Register first
    await request(app)
      .post('/users/register')
      .send({
        username: 'TestLogin',
        email: uniqueEmail,
        password: '123456'
      });

    // Then login
    const res = await request(app)
      .post('/users/login')
      .send({
        email: uniqueEmail,
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
