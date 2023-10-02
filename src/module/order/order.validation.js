import joi from 'joi';
import { generalFailed } from '../../middleware/validation.middleware.js';
export const createOrderSchema=joi.object({
    products:joi.array().items(joi.object().keys({
        productId:generalFailed.id,
        qty:joi.number().positive().required(),
    })).required(),
    phoneNumber:joi.string().required(),
    address:joi.string().required(),
    couponName:joi.string(),
    paymentMethod:joi.string().valid('cash ','card'),
    note:joi.string()
}).required();
export const addAllFromCartSchema=joi.object({
    phoneNumber:joi.string().required(),
    address:joi.string().required(),
    couponName:joi.string(),
    paymentMethod:joi.string().valid('cash ','card'),
    note:joi.string()
}).required();
export const cancelOrderSchema=joi.object({
    orderId:generalFailed.id,
    rejectReason:joi.string()
}).required();
export const changeStatusSchema=joi.object({
    status:joi.string().required(),
    orderId:generalFailed.id
}).required();