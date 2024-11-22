import cartModel from "../../../../DB/model/cart.model.js"
import productModel from "../../../../DB/model/product.model.js";
export const addToCart =async(req,res,next)=>{
    const {productId,qty} = req.body;
    let product = await productModel.findById(productId);
    if(!product){
        return next(new Error(`invalid product id`,{cause:400}));
    }
    if(product.stock< qty){
        return next(new Error(`invalid product quntity`,{cause:400}));
    }
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart){
        const newCart = await cartModel.create({userId:req.user._id, products:[{productId,qty,name:product.name}]})
        return res.status(201).json({message:"success",newCart});
    }
    let matchProduct = false;
    for(let i =0;i<cart.products.length;i++){
        if(cart.products[i].productId.toString()==productId){
            cart.products[i].qty= parseInt(cart.products[i].qty) + parseInt(qty);
            matchProduct= true;
            break;
        }
    }
    if(!matchProduct){
        cart.products.push({productId,qty,name:product.name});
    }
    await cart.save();
    return res.json({message:"success",cart});
}
export const removeProductFromCart= async(req,res,next)=>{
    const {productId} =req.body;
    const cart = await cartModel.findOneAndUpdate({userId:req.user._id},{$pull:{products:{productId}}},{new:true});
    return res.json({message:"success",cart});
}
export const clearCart = async(req,res,next)=>{
    const cart = await cartModel.findOneAndUpdate({userId:req.user._id},{products:[]});
    return res.json({message:"success"});
}
export const getCart= async(req,res,next)=>{
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart){
        return next(new Error(`no cart created yet`,{cause:404}));
    }
    return res.json({message:`success`,cart});
}