import mongoose, { Schema,model,Types } from "mongoose";
const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{type:Types.ObjectId , ref:'Product',required:true},
        productName:{type:String,required:true},
        qty:{type:Number, required:true},
        unitPrice:{type:Number, required:true},
        finalPrice:{type:Number,required:true},
        _id:false
    }],
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    finalPrice:{
        type:Number,
        required:true
    },
    couponId:{
        type:Types.ObjectId,
        ref:'Coupon',
    },
    status:{
        type:String,
        enum:['pending','approved','canceled','onWay','delivered'],
        default:'pending'
    },
    paymentMethod:{
        type:String,
        enum:['cach','card'],
        default:'cach',
    },
    note:String,
    rejectReason:String,
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});
const orderModel = mongoose.models.Order || model('Order',orderSchema);
export default orderModel;