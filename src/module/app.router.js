import { Router } from "express";
import { connectDB } from "../../DB/connection.js";
import authRouter from './auth/auth.router.js';
import  categoryRouter from './category/category.router.js'; 
import  subcategoryRouter from './subcategory/subcategory.router.js';
import couponRouter from '../module/coupon/coupon.router.js';
import brandRouter from '../module/brand/brand.router.js';
import { globalErrorHandller } from "../services/errorHandling.js";
import productRouter from './product/product.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import cors from 'cors';
const router = Router();
export const initApp =(express,app)=>{
    app.use(async(req,res,next)=>{
        var whiteList =['https://sparkling-kleicha-771e24.netlify.app'];
        if(!whiteList.includes(req.header('origin'))){
            return next(new Error(`invalid origin`,{cause:403}));
        }else{
            next();
        }
    });
    connectDB();
    app.use(cors());
    app.use(express.json());
    app.get('/',(req,res)=>{
        return res.json({message:'Hello....!!'});
    });
    app.use('/auth',authRouter);
    app.use('/category',categoryRouter);
    app.use('/subcategory',subcategoryRouter);
    app.use('/coupon',couponRouter);
    app.use('/brand',brandRouter);
    app.use('/product',productRouter);
    app.use('/cart',cartRouter);
    app.use('/order',orderRouter);
    app.use(globalErrorHandller);
    app.use('*',(req,res)=>{
        return res.status(404).json({message:"Page Not Found"});
    });
}