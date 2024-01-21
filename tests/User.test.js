"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const User_1 = require("../models/User");
// Mock database connection
jest.mock('../database', () => jest.fn());
// Mock Mongoose User model methods
jest.mock('../models/User', () => {
    return {
        User: {
            findOne: jest.fn(),
            // Mock other methods as necessary
        },
    };
});
describe('POST /users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create a new user and return 201 status', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(User_1.User, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(User_1.User.prototype, 'save').mockResolvedValueOnce({
            "settings": {
                "notificationSettings": {
                    "emailNotifications": true,
                    "smsNotifications": false,
                    "pushNotifications": true,
                    "_id": "65a46e6058b554e7932faa1a"
                },
                "theme": "light",
                "timezone": "America/Los_Angeles"
            },
            "_id": "659d9015df4a8b0e1c23e148",
            "username": "test",
            "email": "tset@example.com",
            "role": "user",
            "createdAt": "2024-01-09T18:27:33.762Z",
            "updatedAt": "2024-01-14T23:29:36.697Z",
            "__v": 0
        });
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
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/users')
            .send(newUser);
        expect(User_1.User.findOne).toHaveBeenCalledWith({ email: newUser.email });
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe('User created successfully');
    }));
    it('should return 400 status when email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking the User.findOne method to simulate finding an existing user
        jest.spyOn(User_1.User, 'findOne').mockResolvedValueOnce({
            _id: 'mockedUserId',
            username: 'existingUser',
            email: 'test@example.com',
            password: 'Test@123',
            role: 'user',
        });
        const newUser = {
            username: 'newUser',
            email: 'test@example.com',
            password: 'Test@123',
            role: 'user'
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/users')
            .send(newUser);
        expect(User_1.User.findOne).toHaveBeenCalledWith({ email: newUser.email });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Email already in use');
    }));
});
