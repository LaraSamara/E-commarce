import moment from "moment";
import couponModel from "../../../../DB/model/coupon.model.js";
import productModel from "../../../../DB/model/product.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import cartModel from "../../../../DB/model/cart.model.js";
import createInvoice from "../../../services/pdf.js";
import { sendEmail } from "../../../services/sendEmail.js";
export const createOrder =async(req,res,next)=>{
    let {products,phoneNumber,address,couponName,paymentMethod,note} = req.body;
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName.toLowerCase()});
        if(!coupon){
            return next(new Error(`invalid coupon id`,{cause:400}));
        }
        const now = moment();
        const date = moment(coupon.expireDate,'MM/DD/YYYY');
        const diff = now.diff(date,'days');
        if(diff>=0){
            return next(new Error(`coupon is expired`,{cause:400}));
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`coupon is used by you`));
        }
        req.body.coupon = coupon;
    }
    let subtotal = 0;
    let productIdList =[];
    for(let product of products){
        const checkProduct = await productModel.findOne({_id:product.productId,isDeleted:false});
        if(!checkProduct){
            return next(new Error(`invalid product id ${product.productId}`,{cause:400}));
        }
        if(checkProduct.stock < product.qty){
            return next(new Error(`invalid product quntity of ${product.productId}`,{cause:400}));
        }
        product.productName = checkProduct.name;
        product.unitPrice= checkProduct.price;
        product.finalPrice=product.qty * checkProduct.price;
        productIdList.push(product.productId);
        subtotal += product.finalPrice;
    }
    const order = await orderModel.create({
        products,
        phoneNumber,
        address,
        couponId:req.body.coupon?._id,
        paymentMethod,
        note,
        subtotal,
        finalPrice:subtotal -(subtotal*((req.body.coupon?.amount ||0)/100)),
        userId:req.user._id,
        status:(paymentMethod == 'card')?'approved':'pending',
    });
    for(const product of products){
        await productModel.findByIdAndUpdate(product.productId,{$inc:{stock:-product.qty}});
    }
    if(req.body.coupon){
        await couponModel.findByIdAndUpdate(req.body.coupon._id,{$addToSet:{usedBy:req.user._id}});
    }
    await cartModel.findByIdAndUpdate(req.user._id,{$pull:{products:{$in:productIdList}}});
const invoice = {
shipping: {
    name:req.user.userName.toUpperCase(),
    address
  },
  items:order.products,
  subtotal: order.subtotal,
  paid: order.finalPrice,
  invoice_nr:order._id
};
createInvoice(invoice, "invoice.pdf");
sendEmail(req.user.email,'invoice attachment',`<h2>Invoice attachment</h2>`,{
    path:`invoice.pdf`,
    contentType:'application/pdf'
});
    return res.json({message:"success",order});
}
export const addAllFromCart = async(req,res,next)=>{
    let {phoneNumber,address,couponName,paymentMethod,note} = req.body;
    const cart = await  cartModel.findOne({userId:req.user._id});
    if(!cart?.products?.length){
        return next(new Error(`empty cart`,{cause:400}));
    }
    req.body.products = cart.products;
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName.toLowerCase()});
        if(!coupon){
            return next(new Error(`invalid coupon `,{cause:400}));
        }
        let now = moment();
        let date = moment(coupon.expireDate,'MM/DD/YYYY');
        let diff = now.diff(date);
        if(diff >= 0){
            return next(new Error(`expired coupon`,{cause:400}));
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`coupon used by you`));
        }
        req.body.coupon = coupon;
    }
    let subtotal =0
    let products = req.body.products.toObject();
    for(let product of products ){
        const checkProduct = await productModel.findOne({_id:product.productId,isDeleted:false});
        if(!checkProduct){
            return next(new Error(`invalid product id`,{cause:400}));
        }
        if(checkProduct.stock < product.qty){
            return nect(new Error(`invalid product quentity`));
        }
        product.unitPrice = checkProduct.price;
        product.finalPrice = product.qty*checkProduct.price;
        product.productName = checkProduct.name;
        subtotal += product.finalPrice;
    }
    const order = await orderModel.create({
    phoneNumber,
    address,
    couponId:req.body.coupon?._id,
    paymentMethod,
    note,
    userId:req.user._id,
    status:(paymentMethod == 'card')?'approved':'pending',
    finalPrice:subtotal - (subtotal*(req.body.coupon?.amount || 0 /100)),
    subtotal,
    products:products
    });
    for(const product of products){
        await productModel.findByIdAndUpdate(product.productId,{$inc:{stock:-product.qty}});
    }
    if(req.body.coupon){
        await couponModel.findByIdAndUpdate(req.body.coupon._id,{$addToSet:{usedBy:req.user._id}});
    }
    cart.products =[];
    await cart.save();
    return res.status(201).json({message:"success",order});
    
}
export const cancelOrder = async (req,res,next)=>{
    const {orderId} = req.params;
    const {rejectReason} = req.body;
    const order = await orderModel.findById(orderId);
    if(!order || order.status!='pending'||order.paymentMethod!='cach'){
        return next(new Error(`cann't cancle the  order`,{cause:400}));
    }
    order.status='canceled';
    order.rejectReason=rejectReason;
    order.updatedBy = req.user._id;
    await order.save();
    for(const product of order.products){
        await productModel.findByIdAndUpdate(product.productId,{$inc:{stock:product.qty}});
    }
    if(order.couponId){
        await couponModel.findByIdAndUpdate(order.couponId,{$pull:{usedBy:order.userId}});
    }
    return res.json({message:"success"});
}
export const changeStatus = async (req,res,next)=>{
    const {status} =req.body;
    const {orderId} = req.params;
    const order = await orderModel.findById(orderId);
    if(!order || order.status == 'delivered' || order.paymentMethod == 'card'){
        return next(new Error(`cann't change order's status`,{cause:400}));
    }
    order.status = status;
    order.updatedBy = req.user._id;
    await order.save();
    return res.json({message:"success"})
}
