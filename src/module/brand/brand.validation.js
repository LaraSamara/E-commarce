import joi from 'joi';
import { generalFailed } from '../../middleware/validation.middleware.js';
export const createBrand = joi.object({
    name:joi.string().min(2).max(20).required(),
    categoryId:generalFailed.id,
    file:generalFailed.file.required()
}).required();

export const getAllBrand = joi.object({
    categoryId:generalFailed.id.required()
}).required();