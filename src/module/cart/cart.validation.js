import joi from "joi"
import { generalFailed } from "../../middleware/validation.middleware.js";
export const addToCartSchema=joi.object({
    productId:generalFailed.id,
    qty:joi.number().positive().required()
}).required();
export const removeProductFromCartSchema=joi.object({
    productId:generalFailed.id
}).required();