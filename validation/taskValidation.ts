import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

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

const validateUpdateTask = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateTask = (req: Request, res: Response, next: NextFunction) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

export { validateTask, validateUpdateTask };
