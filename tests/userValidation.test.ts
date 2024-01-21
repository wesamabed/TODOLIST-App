import { Request, Response, NextFunction } from 'express';
import {
  validateCreateUser,
  validateChangePassword,
  validateUpdateUsername,
  validateUpdateEmail,
  validateUpdateSettings,
  validateUpdateNotificationSettings
} from '../validation/userValidation'; 

// Mocking Express.js Request, Response, and NextFunction
const mockRequest = (body: any) => {
  return body as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

const nextFunction: NextFunction = jest.fn();

describe('User Validation Tests', () => {
  // Test for validateCreateUser
  describe('validateCreateUser', () => {
    it('should pass with valid data', () => {
      // Add a valid user data
      const req = mockRequest({
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'P@ssw0rd!',
          role: 'user',
          settings: {
            theme: 'dark'
          }
        }
      });
      const res = mockResponse();

      validateCreateUser(req, res, nextFunction);

      expect(nextFunction).toBeCalled();
    });

    it('should fail with invalid data', () => {
      // Add invalid user data
      const req = mockRequest({
        body: {
          username: 'testuser',
          email: 'invalid-email',
          password: 'password',
          role: 'invalid-role',
          settings: {
            theme: 'invalid-theme'
          }
        }
      });
      const res = mockResponse();

      validateCreateUser(req, res, nextFunction);

      expect(res.status).toBeCalledWith(400);
    });
  });

 

// Test for validateChangePassword
describe('validateChangePassword', () => {
    it('should pass with valid data', () => {
      const req = mockRequest({
        body: {
          newPassword: 'N3wP@ssw0rd!'
        }
      });
      const res = mockResponse();
  
      validateChangePassword(req, res, nextFunction);
  
      expect(nextFunction).toBeCalled();
    });
  
    it('should fail with invalid data', () => {
      const req = mockRequest({
        body: {
          newPassword: 'password'
        }
      });
      const res = mockResponse();
  
      validateChangePassword(req, res, nextFunction);
  
      expect(res.status).toBeCalledWith(400);
    });
  });
  
  // Test for validateUpdateUsername
  describe('validateUpdateUsername', () => {
    it('should pass with valid data', () => {
      const req = mockRequest({
        body: {
          username: 'newUsername'
        }
      });
      const res = mockResponse();
  
      validateUpdateUsername(req, res, nextFunction);
  
      expect(nextFunction).toBeCalled();
    });
  
    it('should fail with invalid data', () => {
      const req = mockRequest({
        body: {
          username: ''
        }
      });
      const res = mockResponse();
  
      validateUpdateUsername(req, res, nextFunction);
  
      expect(res.status).toBeCalledWith(400);
    });
  });
  
  // Test for validateUpdateEmail
  describe('validateUpdateEmail', () => {
    it('should pass with valid data', () => {
      const req = mockRequest({
        body: {
          email: 'newemail@example.com'
        }
      });
      const res = mockResponse();
  
      validateUpdateEmail(req, res, nextFunction);
  
      expect(nextFunction).toBeCalled();
    });
  
    it('should fail with invalid data', () => {
      const req = mockRequest({
        body: {
          email: 'not-an-email'
        }
      });
      const res = mockResponse();
  
      validateUpdateEmail(req, res, nextFunction);
  
      expect(res.status).toBeCalledWith(400);
    });
  });
  
  // Test for validateUpdateSettings
  describe('validateUpdateSettings', () => {
    it('should pass with valid data', () => {
      const req = mockRequest({
        body: {
          theme: 'light'
        }
      });
      const res = mockResponse();
  
      validateUpdateSettings(req, res, nextFunction);
  
      expect(nextFunction).toBeCalled();
    });
  
    it('should fail with invalid data', () => {
      const req = mockRequest({
        body: {
          theme: 'invalid-theme'
        }
      });
      const res = mockResponse();
  
      validateUpdateSettings(req, res, nextFunction);
  
      expect(res.status).toBeCalledWith(400);
    });
  });
  
  // Test for validateUpdateNotificationSettings
  describe('validateUpdateNotificationSettings', () => {
    it('should pass with valid data', () => {
      const req = mockRequest({
        body: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true
        }
      });
      const res = mockResponse();
  
      validateUpdateNotificationSettings(req, res, nextFunction);
  
      expect(nextFunction).toBeCalled();
    });
  
    it('should fail with invalid data', () => {
      const req = mockRequest({
        body: {
          emailNotifications: 'yes', 
          smsNotifications: false,
          pushNotifications: true
        }
      });
      const res = mockResponse();
  
      validateUpdateNotificationSettings(req, res, nextFunction);
  
      expect(res.status).toBeCalledWith(400);
    });
  });
  

});

