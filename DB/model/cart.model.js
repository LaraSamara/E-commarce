import mongoose, { Schema, Types, model } from "mongoose";
const cartSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{type:Types.ObjectId,ref:'User',required:true},
        qty:{type:Number,default:1},
        name:{type:String,required:true},
        _id:false
    }]
},{timestamps:true});
const cartModel = mongoose.models.Cart || model('Cart',cartSchema);
export default cartModel;