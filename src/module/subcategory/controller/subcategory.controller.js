import categoryModel from "../../../../DB/model/category.model.js";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from "slugify";
export const createSubcategory =async (req,res,next)=>{
    const {categoryId} =req.params;
    const name=req.body.name.toLowerCase();
    const category = await categoryModel.findById(categoryId);
    if(!category){
        return next(new Error(`invalid category ${categoryId}`,{cause:404}));
    }
    let subcategory = await subcategoryModel.findOne({name});
    if(subcategory){
        return next(new Error('subcategory is already exist',{cause:409}));
    }
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/subcategory`});
    subcategory = await subcategoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},categoryId,createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:"success",subcategory});
}
export const updateSubcategory =async (req,res,next)=>{
    const{subcategoryId,categoryId}=req.params;
    let subcategory = await subcategoryModel.findOne({_id:subcategoryId,categoryId});
    if(!subcategory){
        return next(new Error(`invalid category Id ${categoryId} or invalid subcategory Id ${subcategoryId}`),{cause:400});
    }
    if(req.body.name){
        if(subcategory.name == req.body.name.toLowerCase()){
            return next(new Error(`old name match new name`),{cause:400});
        }
        if(await subcategoryModel.findOne({name:req.body.name.toLowerCase()})){
            return next(new Error(`duplicate subcategory name`,{cause:409}));
        }
        subcategory.name = req.body.name.toLowerCase();
        subcategory.slug =slugify(req.body.name.toLowerCase());
    }
    if(req.file){
        const{secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/subcategory`});
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        subcategory.image = {secure_url,public_id};
    }
    subcategory.updatedBy=req.user._id;
    await subcategory.save();
    return res.json({message:"success",subcategory});
}
export const getSpeceficSubcategory =async (req,res,next)=>{
    const {categoryId}=req.params;
    let subcategory = await subcategoryModel.find({categoryId});
    if(!subcategory){
        return next(new Error(`invalid category id ${categoryId} or invalid subcategory id ${subcategoryId}`));
    }
    return res.json({message :"success",subcategory});
}
export const getAllSubcategory =async (req,res,next)=>{
    const categories = await categoryModel.find({}).populate('subcategory');
    return res.json({message:"success",categories});
}