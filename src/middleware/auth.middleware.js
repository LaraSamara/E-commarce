import userModel from "../../DB/model/user.model.js";
import { asyncHandller } from "../services/errorHandling.js"
import { verifyToken } from "../services/genereteAndVerifyToken.js";
export const roles ={
    Admin:'Admin',
    User:'User'
}
export const auth =(accessRoles=[])=>{
    return asyncHandller(async(req,res,next)=>{
        const {authorization} =req.headers;
        if(!authorization?.startsWith(process.env.BEARER_KEY)){
            return next(new Error('Bearer key is required',{cause:400}));
        }
        const token = authorization.split(process.env.BEARER_KEY)[1];
        if(!token){
            return next(new Error('token is required',{cause:400}));
        }
        const decoded = verifyToken(token,process.env.SIGNIN_SIGNITURE);
        if(!decoded){
            return next(new Error('invalid token payload',{cause:400}));
        }
        let user =await userModel.findById(decoded.id).select('role userName email');
        if(!user){
            return next(new Error('not registered account ',{cause:404}));
        }
        if(!accessRoles.includes(user.role)){
            return next(new Error('not authorized user',{cause:403}))
        }
        if(parseInt(user.forgetPasswordTime?.getTime()/1000)>decoded.iat){
            return next(new Error(`expired token`,{cause:400}));
        }
        req.user = user;
        return next();
    })
}