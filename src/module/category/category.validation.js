import joi from 'joi';
import { generalFailed } from '../../middleware/validation.middleware.js';
export const createCategorySchema = joi.object({
    name:joi.string().min(2).max(20).required(),
    file:generalFailed.file.required()
}).required();
export const updateCategorySchema = joi.object({
    categoryId:generalFailed.id,
    name:joi.string().min(2).max(20),
    file:generalFailed.file
}).required();
export const getSpecificCategory = joi.object({
    categoryId:generalFailed.id.required()
});