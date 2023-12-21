const Joi = require('joi');
const TagCategorySchema = Joi.object({
    name: Joi.string().required().trim(),
    type: Joi.string().valid('tag', 'category').required(),
    description: Joi.string().trim().optional(),
    tasks: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
    owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).when('type', { is: 'category', then: Joi.required() })
});

const validateTagCategory = (req, res, next) => {
    const { error } = TagCategorySchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
const updateTagCategorySchema = Joi.object({
    name: Joi.string().trim().optional(),
    type: Joi.string().valid('tag', 'category').optional(),
    description: Joi.string().trim().optional(),
    tasks: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
    owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
}).min(1);

const validateUpdateTagCategory = (req, res, next) => {
    const { error } = updateTagCategorySchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
module.exports = { validateTagCategory, validateUpdateTagCategory};