import { Router } from "express";
import * as couponController from './controller/coupon.controller.js';
import * as validators from './coupon.validation.js';
import { asyncHandller } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./coupon.endpoint.js";
const router = Router();
router.post('/',auth(endPoints.create),asyncHandller(couponController.createCoupon))
router.put('/:couponId',auth(endPoints.update),validation(validators.updateCoupon),asyncHandller( couponController.updateCoupon));
router.get('/' ,auth(endPoints.get),asyncHandller(couponController.getCoupones));
router .get('/:couponId',auth(endPoints.get),validation(validators.getSpecificCoupon), asyncHandller(couponController.getSpecificCoupon))
export default router;