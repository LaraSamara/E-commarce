import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import * as productController from './controller/product.controller.js';
import { asyncHandller } from "../../services/errorHandling.js";
import { fileUpload, fileValidation } from "../../services/cloudinaryMulter.js";
import { endPoints } from "../product/product.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./product.validation.js";
import reviewRouter from '../review/review.router.js';
const router = Router({mergeParams:true});
router.post('/',auth(endPoints.create),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:4}
    ]),validation(validators.createProductSchema),asyncHandller( productController.createProduct));
router.put('/:productId',auth(endPoints.update),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount: 1},
    {name:'subImages',maxCount:5}
    ]),validation(validators.updateProductSchema),asyncHandller(productController.updateProduct));
router.get('/',asyncHandller(productController.getProducts));
router.patch('/softDelete/:productId',auth(endPoints.update),validation(validators.softDeleteSchema),productController.softDelete);
router.get('/softeDeletedProducts',auth(endPoints.get),asyncHandller(productController.getsoftDeletedProducts));
router.delete('/forceDelete/:productId',auth(endPoints.delete),validation(validators.forceDeleteSchema),asyncHandller(productController.forceDelete));
router.patch('/restore/:productId',auth(endPoints.update),validation(validators.restoreSchema),asyncHandller(productController.restore));
router.get('/:productId',auth(endPoints.get),validation(validators.getSpeceficProductSchema),productController.getSpeceficProduct);
router.use('/:productId/review',reviewRouter);
export default router;