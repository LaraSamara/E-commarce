import joi from "joi"
import { generalFailed } from "../../middleware/validation.middleware.js"
export const createProductSchema =joi.object({
    name:joi.string().required(),
    description:joi.string().required(),
    price:joi.number().positive().required(),
    discount:joi.number().min(1).max(100),
    stock:joi.number().positive(),
    size:joi.array().items(joi.string().valid('S','M','L','XL')),
    colors:joi.array().items(joi.string()),
    files:joi.object({
        subImages:joi.array().items(generalFailed.file),
        mainImage:joi.array().items(generalFailed.file).required()
}),
    categoryId:generalFailed.id.required(),
    subCategoryId:generalFailed.id.required(),
    brandId:generalFailed.id.required(),
}).required();
export const updateProductSchema =joi.object({
    name:joi.string(),
    description:joi.string(),
    price:joi.number().positive(),
    discount:joi.number().min(1).max(100),
    stock:joi.number().positive(),
    size:joi.array().items(joi.string().valid('S','M','L','XL')),
    colors:joi.array().items(joi.string()),
    mainImage:generalFailed.file,
    subImages:generalFailed.file,
    categoryId:generalFailed.id,
    subCategoryId:generalFailed.id,
    brandId:generalFailed.id,
    productId:generalFailed.id.required()
}).required();
export const getProductsSchema =joi.object({
    subCategoryId:generalFailed.id.required()
}).required();
export const getSpeceficProductSchema =joi.object({
    productId:generalFailed.id.required(),
    subCategoryId:generalFailed.id.required()
}).required();
export const softDeleteSchema =joi.object({
    productId:generalFailed.id.required()
}).required();
export const forceDeleteSchema =joi.object({
    productId:generalFailed.id.required()
}).required();
export const restoreSchema =joi.object({
    productId:generalFailed.id.required()
}).required();
