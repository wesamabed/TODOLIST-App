"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateNotificationSettings = exports.validateUpdateSettings = exports.validateUpdateEmail = exports.validateUpdateUsername = exports.validateChangePassword = exports.validateCreateUser = void 0;
const Joi = __importStar(require("joi"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const notificationSettingsSchema = Joi.object({
    emailNotifications: Joi.boolean(),
    smsNotifications: Joi.boolean(),
    pushNotifications: Joi.boolean()
});
const validateUpdateNotificationSettings = (req, res, next) => {
    const { error } = notificationSettingsSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateUpdateNotificationSettings = validateUpdateNotificationSettings;
const settingsSchema = Joi.object({
    notificationSettings: notificationSettingsSchema,
    theme: Joi.string().valid('light', 'dark', 'auto'),
    timezone: Joi.string()
});
const createUserSchema = Joi.object({
    username: Joi.string().required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().pattern(passwordComplexityRegex).required(),
    role: Joi.string().valid('user', 'admin', 'manager'),
    settings: settingsSchema
});
const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().optional(),
    newPassword: Joi.string().pattern(passwordComplexityRegex).required()
});
const validateChangePassword = (req, res, next) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateChangePassword = validateChangePassword;
const updateUsernameSchema = Joi.object({
    username: Joi.string().required().trim()
});
const validateUpdateUsername = (req, res, next) => {
    const { error } = updateUsernameSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateUpdateUsername = validateUpdateUsername;
const validateCreateUser = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateCreateUser = validateCreateUser;
const updateEmailSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim()
});
const validateUpdateEmail = (req, res, next) => {
    const { error } = updateEmailSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateUpdateEmail = validateUpdateEmail;
const updateSettingsSchema = Joi.object({
    theme: Joi.string().valid('light', 'dark', 'auto').optional(),
    timezone: Joi.string().optional()
}).min(1);
const validateUpdateSettings = (req, res, next) => {
    const { theme, timezone } = req.body;
    const { error } = updateSettingsSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    if (timezone && !moment_timezone_1.default.tz.zone(timezone)) {
        return res.status(400).send('Invalid timezone');
    }
    next();
};
exports.validateUpdateSettings = validateUpdateSettings;
