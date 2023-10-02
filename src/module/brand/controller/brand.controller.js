import slugify from "slugify";
import barandModel from "../../../../DB/model/brand.model.js";
import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const createBrand =async(req,res,next)=>{
    let {name,categoryId} = req.body;
    name = name.toLowerCase();
    if(!await categoryModel.findById(categoryId)){
        return next(new Error(`invalid category id ${categoryId}`,{cause:400}));
    }
    if(await barandModel.findOne({name})){
        return next(new Error(`duplicate brand name`,{cause:409}));
    }
    const {secure_url ,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/brand`});
    const brand = await barandModel.create({name,slug:slugify(name),categoryId,image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:"success",brand});
}
export const getAllBrand =async(req,res,next)=>{
    const {categoryId} = req.params;
    const brands = await barandModel.find({categoryId});
    if(brands.length == 0){
        return next(new Error(`no brands created yet for ${categoryId} category id`));
    }
    return res.status(200).json({message:"success",brands});
}
export const updateBrand = async(req,res,next)=>{
    let brand = await barandModel.findById(req.params.brandId);
    if(!brand){
        return next(new Error(`invalid brand id`,{cause:400}));
    }
    if(req.body.name){
        const name = req.body.name.toLowerCase();
        if(name == brand.name){
            return next(new Error(`old name match new name `,{cause:400}));
        }
        if(await barandModel.findOne({name})){
            return next(new Error(`duplicate brand name`,{cause:409}))
        }
        req.body.name = name;
        req.body.slug = slugify(name);
    }
    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/brand`});
        await cloudinary.uploader.destroy(brand.image.public_id);
        req.body.image = {secure_url,public_id};
    }
    req.body.updatedBy = req.user._id;
    brand = await barandModel.findOneAndUpdate(req.body);
    return res.status(200).json({message:'success',brand});
    
}