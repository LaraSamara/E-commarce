import joi from "joi";
import { generalFailed } from "../../middleware/validation.middleware.js";
export const createCoupon = joi.object({
    name:joi.string().min(2).max(20).required(),
    amount:joi.number().positive().min(1).max(100),
    expireDate:joi.date().required()
}).required();
export const updateCoupon = joi.object({
    name:joi.string().min(2).max(20),
    amount:joi.number().positive().min(1).max(100),
    couponId:generalFailed.id.required()
}).required();
export const getSpecificCoupon = joi.object({
    couponId:generalFailed.id.required()
}).required();