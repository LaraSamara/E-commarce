import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { endpoints } from "./cart.endpoint.js";
import * as cartController from './controller/cart.controller.js';
import { asyncHandller } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './cart.validation.js';
const router = Router();
router.post('/',auth(endpoints.create),validation(validators.addToCartSchema),asyncHandller(cartController.addToCart));
router.patch('/removeProductFromCart',auth(endpoints.update),validation(validators.removeProductFromCartSchema),asyncHandller(cartController.removeProductFromCart));
router.patch('/clearCart',auth(endpoints.update),asyncHandller(cartController.clearCart));
router.get('/',auth(endpoints.get),asyncHandller(cartController.getCart));
export default router;