import joi from "joi";
import { generalFailed } from "../../middleware/validation.middleware.js";
export const createSubcategorySchema = joi.object({
    categoryId:generalFailed.id.required(),
    file:generalFailed.file.required(),
    name:joi.string().min(2).max(20).required()
}).required();
export const updateSubcategorySchema = joi.object({
    categoryId:generalFailed.id.required(),
    subcategoryId:generalFailed.id.required(),
    name:joi.string().min(2).max(20),
    file:generalFailed.file
}).required();
export const getSpeceficSubcategory =joi.object({
    categoryId:generalFailed.id.required(),
}).required();