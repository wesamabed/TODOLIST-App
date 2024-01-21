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
exports.validateUpdateTask = exports.validateTask = void 0;
const Joi = __importStar(require("joi"));
const commentSchema = Joi.object({
    content: Joi.string().required(),
    author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId pattern
});
const taskSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().trim(),
    dueDate: Joi.date(),
    priority: Joi.string().valid('Low', 'Medium', 'High'),
    status: Joi.string().valid('Todo', 'In Progress', 'Done'),
    owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    categories: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
    reminders: Joi.array().items(Joi.date()),
    subTasks: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)), // Validate subTasks as MongoDB ObjectIds
    comments: Joi.array().items(commentSchema)
});
const updateTaskSchema = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
    status: Joi.string().valid('Todo', 'In Progress', 'Done').optional(),
    owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    categories: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
    reminders: Joi.array().items(Joi.date()).optional(),
    subTasks: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(), // Same change for update schema
    comments: Joi.array().items(commentSchema).optional()
}).min(1);
const validateUpdateTask = (req, res, next) => {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateUpdateTask = validateUpdateTask;
const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
exports.validateTask = validateTask;
