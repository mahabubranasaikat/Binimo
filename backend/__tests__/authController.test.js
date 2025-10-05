const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');

// Mock the User model
jest.mock('../src/models/User');

describe('Auth Controller', () => {
    describe('signup', () => {
        it('should create a user successfully', async () => {
            // Mock implementations
            User.findByEmail.mockImplementation((email, callback) => callback(null, []));
            User.findByUsername.mockImplementation((username, callback) => callback(null, []));
            User.create.mockImplementation((userData, callback) => callback(null, { insertId: 1 }));

            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const { signup } = require('../src/controllers/authController');
            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
        });

        it('should return error for missing fields', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const { signup } = require('../src/controllers/authController');
            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
        });
    });
});