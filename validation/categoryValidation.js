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
exports.validateUpdateTagCategory = exports.validateTagCategory = void 0;
const Joi = __importStar(require("joi"));
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
exports.validateTagCategory = validateTagCategory;
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
exports.validateUpdateTagCategory = validateUpdateTagCategory;
