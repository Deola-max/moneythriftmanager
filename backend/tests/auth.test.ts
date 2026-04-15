import request from 'supertest';
import { app } from '../src/index';
import User, { UserRole } from '../src/models/User';
import mongoose from 'mongoose';
import { describe, beforeAll, afterAll, beforeEach, it, expect } from '@jest/globals';

// Extend the global namespace to include our test helpers
declare global {
  var signup: () => Promise<{token: string; user: any}>;
}

// Global signup helper function
global.signup = async () => {
  const userData = {
    email: 'test@test.com',
    password: 'password123',
    fullName: 'Test User',
    role: UserRole.USER
  };

  const user = new User(userData);
  await user.save();

  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: userData.email,
      password: 'password123'
    })
    .expect(200);

  return { token: response.body.token, user };
};

// Test suite for Auth Routes
describe('Auth Routes', () => {
  // Clear all test data before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Test user registration
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.fullName).toBe(userData.fullName);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not register a user with an existing email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      // First registration should succeed
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email should fail
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('Email already in use');
    });
  });

  // Test user login
  describe('POST /api/auth/login', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    };

    beforeEach(async () => {
      // Create a test user before each test
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  // Test get current user
  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const { token } = await global.signup();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'test@test.com');
      expect(response.body).toHaveProperty('fullName', 'Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });
  });
});

// Close the MongoDB connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Routes', () => {
  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.fullName).toBe(userData.fullName);
    });

    it('should not register with invalid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email', password: '123' })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should not register with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          fullName: 'Test User',
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          fullName: 'Test User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: 'test@test.com',
      password: 'password123',
      fullName: 'Test User',
    };

    beforeEach(async () => {
      // Create a test user before login tests
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login existing user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      // First sign up to get a token
      const { token } = await global.signup();

      const response = await request(app)
        .get('/api/auth/me')
        .set('x-auth-token', token)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'test@test.com');
      expect(response.body).toHaveProperty('fullName', 'Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token, authorization denied');
    });

    it('should not get user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('x-auth-token', 'invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Token is not valid');
    });
  });
});
