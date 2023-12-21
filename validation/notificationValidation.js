const Joi = require('joi');

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

module.exports = { validateNotification,validateUpdateNotification };
