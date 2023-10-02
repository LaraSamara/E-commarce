import joi from 'joi';
import { generalFailed } from '../../middleware/validation.middleware.js';
export const signupSchema =joi.object({
    userName:joi.string().min(2).max(20).required(),
    email:generalFailed.email,
    password:generalFailed.password,
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
    gender:joi.string().valid('Male','Female'),
    phone:joi.string(),
    address:joi.string(),
}).required();
export const token =joi.object({
    token:joi.string().required()
}).required();
export const signinSchema =joi.object({
    email:generalFailed.email,
    password:generalFailed.password
}).required();
export const sendCodeSchema = joi.object({
    email:generalFailed.email
}).required();
export const forgetPasswordSchema = joi.object({
    email:generalFailed.email,
    password:generalFailed.password,
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
    code:joi.string().required()
}).required();