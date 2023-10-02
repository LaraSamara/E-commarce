import { Router } from "express";
import * as categoryController from './controller/category.controller.js';
import * as validatores from './category.validation.js';
import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload, fileValidation } from "../../services/cloudinaryMulter.js";
import { asyncHandller } from "../../services/errorHandling.js";
import  subcategoryRouter from '../subcategory/subcategory.router.js';
import { auth, roles } from "../../middleware/auth.middleware.js";
import { endPoints } from "./category.endpoint.js";
const router = Router();
router.post('/',auth(endPoints.create),fileUpload(fileValidation.image).single('image'),validation(validatores.createCategorySchema),asyncHandller(categoryController.createCategory));
router.put('/:categoryId',auth(endPoints.update),fileUpload(fileValidation.image).single('image'),validation(validatores.updateCategorySchema), asyncHandller(categoryController.updateCategory));
router.get('/:categoryId',auth(endPoints.get),validation(validatores.getSpecificCategory),asyncHandller(categoryController.getSpecificCategory))
router.get('/',auth(endPoints.get),asyncHandller(categoryController.getAllCategory));
router.use('/:categoryId/subcategory',subcategoryRouter);
export default router;
