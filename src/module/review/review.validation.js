import joi from 'joi';
import { generalFailed } from '../../middleware/validation.middleware.js';
export const createReviewSchema =joi.object({
    comment:joi.string().required(),
    rating:joi.number().positive().min(0).max(5).required(),
    productId:generalFailed.id
}).required();
export const updateReviewSchema =joi.object({
    reviewId:generalFailed.id,
    comment:joi.string(),
    rating:joi.number().positive().min(0).max(5),
    productId:generalFailed.id
}).required();