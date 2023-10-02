import { Router } from "express";
import * as subcategoryController from './controller/subcategory.controller.js';
import { asyncHandller } from "../../services/errorHandling.js";
import { fileUpload, fileValidation } from "../../services/cloudinaryMulter.js";
import * as validators from './subcategory.validation.js';
import { validation } from "../../middleware/validation.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endpoints } from "./subcategory.endpoint.js";
import ProductRouter from '../product/product.router.js';
const router = Router({mergeParams:true});
router.post('/',auth(endpoints.create),fileUpload(fileValidation.image).single('image'),validation(validators.createSubcategorySchema),asyncHandller (subcategoryController.createSubcategory))
router.put('/:subcategoryId',auth(endpoints.update),fileUpload(fileValidation.image).single('image'),validation(validators.updateSubcategorySchema),asyncHandller( subcategoryController.updateSubcategory));
router.get('/',auth(endpoints.get),validation(validators.getSpeceficSubcategory),asyncHandller(subcategoryController.getSpeceficSubcategory));
router.get('/all',auth(endpoints.get),asyncHandller(subcategoryController.getAllSubcategory));
router.use('/:subCategoryId/products',ProductRouter);
export default router;