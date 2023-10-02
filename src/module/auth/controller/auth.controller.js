import userModel from "../../../../DB/model/user.model.js";
import { generateToken, verifyToken } from "../../../services/genereteAndVerifyToken.js";
import { compare, hash } from "../../../services/hashAndCompare.js";
import { sendEmail } from "../../../services/sendEmail.js";
import {customAlphabet} from 'nanoid';
export const signup =async (req,res,next)=>{
    const {userName,email,password,confirmPassword,gender,phone,address} = req.body;
    if(await userModel.findOne({email})){
        return next(new Error('email is already exists ',{cause:409}));
    }
    const hashPassword =hash(password);
    const token = generateToken({email},process.env.EMAIL_SIGNITURE);
    const rToken = generateToken({email},process.env.EMAIL_SIGNITURE,24*60*60);
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const rLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${rToken}`;
    const HTML = `<a href ='${link}'>please confirm your email</a><br/><br/><br/><a href ='${rLink}'>send new email</a>`;
    sendEmail(email,'VERIFY YOUR EMAIL',HTML);
    const user = await userModel.create({userName,email,password:hashPassword,confirmPassword,gender,phone,address});
    return res.status(201).json({message:"success",user});
}
export const confirmEmail =async (req,res,next)=>{
    const {email} = verifyToken(req.params.token,process.env.EMAIL_SIGNITURE);
    if(!email){
        return next(new error('invalid token ',{cause:400}));
    }
    const user = await userModel.updateOne({email},{confirmEmail:"true"});
    if(user.modifiedCount == 0){
        return next(new Error('not regesterd account',{cause:404}));
    }
    return res.status(200).json({message:"email confirmed"});

}
export const newConfirmEmail =async (req,res,next)=>{
    const{email} =  verifyToken(req.params.token,process.env.EMAIL_SIGNITURE);
    if(!email){
        return next(new Error('invalid token', {cause:400}));
    }
    let user = await userModel.findOne({email});
    if(!user){
        return next(new Error('not regestired account ',{cause:404}));
    }
    if(user.confirmEmail ){
        return res.status(200).json({message:"email is confirmed"});
    }
    const token = generateToken({email},process.env.EMAIL_SIGNITURE);
    const link = `http://localhost:3000/auth/confirmEmail/${token}`;
    const HTML = `<a href ="${link}">VERIFY YOUR EMAIL</a>`;
    sendEmail(email,"confirm your email",HTML); 
    return res.status(200).json({message:"<p>new email is send</p>"});
}
export const signin = async(req,res,next)=>{
    const{email, password} =req.body;
    let user = await userModel.findOne({email});
    if(!user){
        return next(new Error('invalid data'));
    }
    if(!user.confirmEmail){
        return next(new Error('please confirm your email'));
    }
    const match = compare(password,user.password);
    if(!match){
        return next(new Error('invalid data'));
    }
    const token = generateToken({id:user._id},process.env.SIGNIN_SIGNITURE);
    const refreshToken = generateToken({_id:user._id},process.env.SIGNIN_SIGNITURE,24*60*60);
    return res.json({message:'success',token,refreshToken});
}
export const sendCode =async (req,res,next)=>{
    const {email} = req.body;
    let code = customAlphabet('123456789larxfrf',6);
    code =code();
    const user = await userModel.findOneAndUpdate({email},{forgetCode:code});
    const HTML =`<p>the code is ${code}</p>`;
    sendEmail(email,'Forget Password',HTML);
    return res.status(200).json({message:"code sent to your email "});
}
export const forgetPassword =async (req,res,next)=>{
    const{email,password,confirmPassword,code} = req.body;
    let user = await userModel.findOne({email});
    if(!user){
        return next(new Error('not registered account',{cause:400}));
    }
    if(user.forgetCode!=code||!code){
        return next(new Error('incorrect code',{cause:400}));
    }
    user.password = hash(password);
    user.forgetCode = null;
    user.changePasswordTime= Date.now();
    await user.save();
    return res.status(200).json({message:"success"})

}