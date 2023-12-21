const Joi = require('joi');

const notificationSettingsSchema = Joi.object({
    emailNotifications: Joi.boolean(),
    smsNotifications: Joi.boolean(),
    pushNotifications: Joi.boolean()
});

const settingsSchema = Joi.object({
    notificationSettings: notificationSettingsSchema,
    theme: Joi.string().valid('light', 'dark', 'auto'),
    timezone: Joi.string()
});

const createUserSchema = Joi.object({
    username: Joi.string().required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required(), 
    role: Joi.string().valid('user', 'admin', 'manager'),
    settings: settingsSchema,
    tasks: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // MongoDB ObjectId pattern
});

const updateUserSchema = createUserSchema.fork(['username', 'email', 'password'], field => field.optional()).min(1);

const validateCreateUser = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateUpdateUser = (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

module.exports = { validateCreateUser, validateUpdateUser };
