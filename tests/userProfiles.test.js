const request = require('supertest');
const app = require('../app');

describe('User Profile API', () => {
  let token;
  let email; // So we can see what email we used if debugging

  beforeAll(async () => {
    // Generate unique email per test run
    email = `profileuser${Date.now()}@example.com`;

    // Register user
    await request(app).post('/users/register').send({
      username: 'ProfileUser',
      email,
      password: 'password123',
    });

    // Login user
    const res = await request(app).post('/users/login').send({
      email,
      password: 'password123',
    });

    token = res.body.token;
  });

  test('should create a new user profile', async () => {
    const res = await request(app)
      .post('/user-profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        age: 25,
        gender: 'male',
        activity_level: 'high',
        dietary_preferences: 'vegan',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('age', 25);
    expect(res.body).toHaveProperty('gender', 'male');
  });

  test('should get the user profile after creation', async () => {
    const res = await request(app)
      .get('/user-profiles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('dietary_preferences', 'vegan');
  });

  test('should update the user profile and reflect changes', async () => {
    const updateRes = await request(app)
      .put('/user-profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        age: 26,
        gender: 'male',
        activity_level: 'moderate',
        dietary_preferences: 'vegetarian',
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('age', 26);
    expect(updateRes.body).toHaveProperty('activity_level', 'moderate');

    // Verify the update
    const getRes = await request(app)
      .get('/user-profiles')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.body).toHaveProperty('dietary_preferences', 'vegetarian');
  });
});
