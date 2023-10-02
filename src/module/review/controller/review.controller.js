import orderModel from "../../../../DB/model/order.model.js";
import reviewModel from "../../../../DB/model/review.model.js";

export const createReview = async(req,res,next)=>{
    const{comment,rating}= req.body;
    const {productId}=req.params;
    const order = await orderModel.findOne({userId:req.user._id,"products.productId":productId});
    if(!order || order.status != 'delivered'){
        return next(new Error(`we cann't review before delivered the product`,{cause:400}));
    }
    if(await reviewModel.findOne({userId:req.user._id,productId})){
        return next(new Error(`you already review`,{cause:400}));
    }
    const review = await reviewModel.create({userId:req.user._id,comment,rating,productId,orderId:order._id});
    return res.json({message:"success",review});
}
export const updateReview = async (req,res,next)=>{
    const {reviewId}=req.params;
    if(!await reviewModel.findById(reviewId)){
        return next(new Error('review not found',{cause:400}));
    }
    const review = await reviewModel.updateOne(req.body);
    return res.json({message:"success",review});
}