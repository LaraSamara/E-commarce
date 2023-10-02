import slugify from "slugify";
import barandModel from "../../../../DB/model/brand.model.js";
import productModel from "../../../../DB/model/product.model.js";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const createProduct = async(req,res,next)=>{
    let {name,price,discount,categoryId,subCategoryId,brandId} = req.body;
    const categoryCheck = await subcategoryModel.findOne({_id:subCategoryId,categoryId});
    if(!categoryCheck){
        return next(new Error(`invalid category id or subcategory id,{cause:400}`) );
    }
    const brandCheck = await barandModel.findById(brandId);
    if(!brandCheck){
        return next(new Error(`invalid brand id `,{cause:400}));
    }
    name = name.toLowerCase();
    if(await productModel.findOne({name})){
        return next(new Error(`duplicate product `,{cause:409}));
    }
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/mainImage`});
    req.body.mainImage ={secure_url,public_id};
    req.body.finalPrice = price -(price*((discount ||0)/100));
    req.body.name = name;
    req.body.slug = slugify(name);
    req.body.subImages =[];
    if(req.files.subImages){
        for(const file of req.files.subImages){
            const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/subImages`});
            req.body.subImages.push({secure_url,public_id});
        }
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const product = await productModel.create(req.body);
    if(!product){
        return next(new Error(`failed to create product`,{cause:400}));
    }
    return res.status(201).json({message:"success",product});

}
export const updateProduct =async (req,res,next)=>{
    let product = await productModel.findById(req.params.productId);
    if(!product){
        return next(new Error(`invalid id`,{cause:400}));
    }
    const {name,description,price,discount,stock,size,colors,categoryId,subCategoryId,brandId}= req.body;
    if(name){
        product.name = name;
        product.slug =slugify(name);
    }
    if(categoryId && subCategoryId){
        const category = await subcategoryModel.findOne({categoryId ,_id:subCategoryId});
        if(!category){
            return next(new Error(`invalid category id or subcategory id`,{cause:400}));
        }
        product.categoryId = categoryId;
        product.subCategoryId = subCategoryId;
    }else if(subCategoryId){
        const category = await subcategoryModel.findOne({_id:subCategoryId,categoryId:product.categoryId});
        if(!category){
            return next (new Error(`it's not a subcategory that belong to ${product.categoryId} category`,{cause:400}));
        }
        product.subCategoryId= subCategoryId;
    }
    if(brandId){
        const brand = await barandModel.findById(brandId);
        if(!brand){
            return next(new Error(`invalid brand id`,{cause:400}));
        }
        product.brandId=brandId;
    }
    if(price && discount){
        product.price = price;
        product.discount = discount;
        product.finalPrice = price - (price*(discount/100));
    }else if(price){
        product.price = price;
        product.finalPrice = price - (price*(product.discount/100));
    }else if(discount){
        product.discount = discount;
        product.finalPrice = product.price -(product.price *(discount/100));
    }
    if(description){
        product.description = description;
    }
    if(stock){
        product.stock=stock;
    }
    if(size){
        product.size=size;
    }
    if(colors){
        product.colors=colors;
    }
    if(req.files.mainImage){
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/mainImage`});
        await cloudinary.uploader.destroy(product.mainImage.public_id);
        product.mainImage = {secure_url,public_id};
    }
    if(req.files.subImages){
        const subImages =[];
        for(let file of req.files.subImages){
            const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/subImages`});
            subImages.push({secure_url,public_id});
        }
        for(let subimage of product.subImages){
            await cloudinary.uploader.destroy(subimage.public_id);
        }
        product.subImages = subImages;
    }
    await product.save();
    return res.status(200).json({message:"success",product});
}    
export const getProducts = async(req,res,next)=>{
    const {subCategoryId}=req.params;
    let {size,page}=req.query;
    if(!size || size<=0){
        size =4;
    }
    if(!page || page<= 0){
        page =1;
    }
    const skip = (page-1)*size;
    const product = await subcategoryModel.findById(subCategoryId).populate({
        path:'product',
        match:{isDeleted:{$eq:false}},
        populate:'review',
        skip,
        limit:size,
    });
    const products = await productModel.find({subCategoryId,isDeleted:false}).populate('review').limit(size).skip(skip);
    // const excludeQueryParams =['page','size','sort','search'];
    // const filterQuery = {...req.query};
    // excludeQueryParams.map(params=>{
    //     delete filterQuery[params];
    // });
    // const query = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g,match=>`$${match}`));
    // const products = await productModel.find().sort(req.query.sort).find(
    //     { $or:[{ name:{$regex:req.query.search,$options:'' }},
    //     {description:{$regex:req.query.search,$options:''}}]}
    // );
    return res.json({message:"success",products});
    
}
export const getSpeceficProduct = async(req,res,next)=>{
    const{productId}=req.params;
    const product = await productModel.findOne({_id:productId,isDeleted:false}).populate('review');
    if(!product){
        return next(new Error(`product not found`,{cause:400}));
    }
    return res.json({message:"success",product});
}
export const softDelete =async(req,res,next)=>{
    const {productId}=req.params;
    const product =await productModel.findByIdAndUpdate(productId,{isDeleted:true});
    return res.json({message:"success"});
}
export const getsoftDeletedProducts =async(req,res,next)=>{
    const products = await productModel.find({isDeleted:true}).populate('review');
    return res.json({message:"success",products});
}
export const forceDelete = async(req,res,next)=>{
    const{productId}=req.params;
    const products = await productModel.findOneAndDelete({_id:productId,isDeleted:true});
    if(!products){
        return next(new Error(`products not found`,{cause:400}));
    }
    return res.json({message:"success",products})
}
export const restore = async(req,res,next)=>{
    const{productId}=req.params;
    const product = await productModel.findByIdAndUpdate(productId,{isDeleted:false});
    if(!product){
        return next(new Error(`product not found`,{cause:400}));
    }
    return res.json({message:"success",product});
}