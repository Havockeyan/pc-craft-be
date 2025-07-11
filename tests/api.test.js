const request = require('supertest');
const app = require('../index'); // Assuming your Express app is exported from index.js

describe('API Tests', () => {
  describe('POST /signup', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/users/signup')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
          phone: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return an error for missing fields', async () => {
      const response = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
    });

    it('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});
