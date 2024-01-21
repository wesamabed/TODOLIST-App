import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const notificationSettingsSchema = Joi.object({
    emailNotifications: Joi.boolean(),
    smsNotifications: Joi.boolean(),
    pushNotifications: Joi.boolean()
});

const validateUpdateNotificationSettings = (req: Request, res: Response, next: NextFunction) => {
    const { error } = notificationSettingsSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};


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


const validateChangePassword = (req: Request, res: Response, next: NextFunction) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const updateUsernameSchema = Joi.object({
    username: Joi.string().required().trim()
});

const validateUpdateUsername = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUsernameSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};



const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};


const updateEmailSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim()
});

const validateUpdateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateEmailSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const updateSettingsSchema = Joi.object({
    theme: Joi.string().valid('light', 'dark', 'auto').optional(),
    timezone: Joi.string().optional()
}).min(1);

const validateUpdateSettings = (req: Request, res: Response, next: NextFunction) => {
    const { theme, timezone } = req.body;
    const { error } = updateSettingsSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    if (timezone && !moment.tz.zone(timezone)) {
        return res.status(400).send('Invalid timezone');
    }
    next();
};



export { validateCreateUser, validateChangePassword, validateUpdateUsername, validateUpdateEmail, validateUpdateSettings, validateUpdateNotificationSettings };
