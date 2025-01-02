const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser',
          userEmail: 'test@test.com',
          password: 'password123',
          role: 'student'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    }, 30000);

    it('should not create a user with existing email', async () => {
      // First create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser1',
          userEmail: 'test@test.com',
          password: 'password123',
          role: 'student'
        });

      // Try to create another user with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser2',
          userEmail: 'test@test.com',
          password: 'password123',
          role: 'student'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    }, 30000);
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      // First create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser',
          userEmail: 'test@test.com',
          password: 'password123',
          role: 'student'
        });

      // Then try to login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          userEmail: 'test@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('userName', 'testuser');
    }, 30000);

    it('should not login with wrong password', async () => {
      // First create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser',
          userEmail: 'test@test.com',
          password: 'password123',
          role: 'student'
        });

      // Try to login with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          userEmail: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    }, 30000);
  });
});
