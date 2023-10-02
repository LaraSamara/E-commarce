import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from "slugify";
export const createCategory =async (req,res,next)=>{
    const name = req.body.name.toLowerCase();
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
    let category = await categoryModel.findOne({name});
    if(category){
        return next(new Error("category is already exist",{cause:409}));
    }
    category = await categoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id});
    return res.json({message:"success",category});
}
export const updateCategory =async(req,res,next)=>{
const {categoryId} = req.params;
let category = await categoryModel.findById(categoryId);
if(!category){
    return next(new Error(`invalid category id ${categoryId}`,{cause:400}));
}
if(req.body.name){
    if(category.name == req.body.name.toLowerCase()){
        return next (new Error('old name match new name',{cause:400}));
    }
    if(await categoryModel.findOne({name:req.body.name.toLowerCase()})){
        return next(new Error('duplicate category name',{cause:409}));
    }
    category.name= req.body.name.toLowerCase();
    category.slug = slugify(req.body.name.toLowerCase());
}
if(req.file){
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image ={secure_url,public_id};
}
category.updatedBy = req.user._id;
await category.save();
return res.json({message:"success",category});
}
export const getSpecificCategory =async (req,res,next)=>{
    const category = await categoryModel.findById(req.params.categoryId);
    if(!category){
        return next(new Error('category not found',{cause:404}));
    }
    return res.json({message:"success",category});
}
export const getAllCategory =async (req,res,next)=>{
    const category = await categoryModel.find({});
    if(category.length == 0){
        return next(new Error('There is No category created yet'))
    }else{
        return res.json({message:"success",category});
    }

}