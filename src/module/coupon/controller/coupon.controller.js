import couponModel from "../../../../DB/model/coupon.model.js";
export const createCoupon = async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    if(await couponModel.findOne({name})){
        return next(new Error(`duplicate coupon name`,{cause:409}));
    }
    let date = new Date(req.body.expireDate);
    let now = new Date();
    if(now.getTime()>= date.getTime()){
        return next(new Error(`invalid expire date`,{cause:400}));
    }
    const expireDate = date.toLocaleDateString();
    const coupon = await couponModel.create({name,createdBy:req.user._id,updatedBy:req.user._id,expireDate,amount:req.body.amount});
    return res.status(201).json({message:"success",coupon});
}
export const updateCoupon = async (req,res,next)=>{
    const {couponId} = req.params;
    let coupon = await couponModel.findById(couponId);
    if(!coupon){
        return next(new Error(`invalid coupon id ${couponId}`,{cause:400}));
    }
    if(req.body.name){
        const name = req.body.name.toLowerCase();
        if(coupon.name == name){
            return next(new Error(`old name match new `,{cause:400}));
        }
        if(await couponModel.findOne({name})){
            return next(new Error(`duplicate coupon name `),{cause:409});
        }
        coupon.name =  name;
    }
    if(req.body.amount){
        coupon.amount = req.body.amount;
    }
    await coupon .save();
    return res.json({message:"success",coupon});
}
export const getCoupones =async (req,res,next)=>{
    const coupons = await couponModel.find({});
    if(coupons.length == 0){
        return next(new Error(`NO coupones created yet`));
    }
    return res.status(200).json({message:"success",coupons});
}
export const getSpecificCoupon =async (req,res,next)=>{
    const {couponId} = req.params;
    const coupon = await couponModel.findById(couponId);
    if(!coupon){
        return next(new Error(`coupon not found`,{cause:404}));
    }
    return res.status(200).json({message:"success",coupon});
}