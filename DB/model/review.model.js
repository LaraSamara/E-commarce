import mongoose,{Schema, Types,model} from "mongoose";
const reviewSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:Types.ObjectId,
        ref:'Product',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    orderId:{
        type:Types.ObjectId,
        ref:'Order',
        required:true
    }
},
{timestamps:true});
const reviewModel = mongoose.models.Review || model('Review',reviewSchema);
export default reviewModel;