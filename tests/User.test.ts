import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

// Mock the entire User model
jest.mock('../models/User', () => {
  const mockUser = {
    save: jest.fn().mockResolvedValue(new mongoose.Types.ObjectId()),
  };
  return {
    User: jest.fn(() => mockUser),
    findOne: jest.fn(),
  };
});

// Import the mocked User model
import { User } from '../models/User';

// Cast to jest.Mock for proper typing
const mockedUserInstance = new User() as any;
const mockedFindOne = User.findOne as jest.Mock;

describe('POST /users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should create a new user and return 201 status', async () => {
    // Mock findOne to simulate no existing user
    mockedFindOne.mockResolvedValue(null);
    // Mock create to simulate user creation

    const newUser = {
      settings: {
        notificationSettings: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true
        },
        theme: 'light',
        timezone: 'America/Los_Angeles'
      },
      username: 'testUser',
      email: 'test@example.com',
      password: 'TEst@123',
      role: 'user'
    };

    const response = await request(app)
      .post('/users')
      .send(newUser);

      expect(mockedFindOne).toHaveBeenCalledWith({ email: newUser.email });
    expect(mockedUserInstance.save).toHaveBeenCalled();
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('User created successfully');
  });

  it('should return 400 status when email already exists', async () => {
    // Mock findOne to simulate an existing user
    mockedFindOne.mockResolvedValue({ email: 'test@example.com' });

    const newUser = {
        settings: {
          notificationSettings: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true
          },
          theme: 'light',
          timezone: 'America/Los_Angeles'
        },
        username: 'testUser',
        email: 'test@example.com',
        password: 'TEst@123',
        role: 'user'
      };

    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(mockedFindOne).toHaveBeenCalledWith({ email: newUser.email });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Email already in use');
  });
});
