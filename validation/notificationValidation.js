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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateNotification = exports.validateNotification = void 0;
const Joi = __importStar(require("joi"));
const notificationSchema = Joi.object({
    type: Joi.string().valid('Email', 'SMS', 'Push').required(),
    content: Joi.string().required(),
    recipient: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    task: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});
const validateNotification = (req, res, next) => {
    const { error } = notificationSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateNotification = validateNotification;
const updateNotificationSchema = Joi.object({
    type: Joi.string().valid('Email', 'SMS', 'Push').optional(),
    content: Joi.string().optional(),
    recipient: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    task: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
}).min(1);
const validateUpdateNotification = (req, res, next) => {
    const { error } = updateNotificationSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateUpdateNotification = validateUpdateNotification;
