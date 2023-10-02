import joi from 'joi';
import { Types } from 'mongoose';
const validationObjectId =(value,helper)=>{
    if(Types.ObjectId.isValid(value)){
        return true;
    }else{
        return helper.message('id is invalid');
    }
}
export const generalFailed ={
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required() ,
        encoding :joi.string().required(),
        mimetype:joi.string().required() ,
        destination:joi.string().required() ,
        filename:joi.string().required() ,
        path:joi.string().required() ,
        size:joi.number().positive().required(),
        dest:joi.string()
}),
    id:joi.string().min(24).max(24).custom(validationObjectId),
    password:joi.string().required(),
    email:joi.string().email().required()
}
export const validation = (Schema)=>{
    return(req,res,next)=>{
        const inputData = {...req.params,...req.query,...req.body};
        if(req.file){
            inputData.file = req.file;
                }
                if(req.files){
                    inputData.files = req.files;
                }
        const validationResult = Schema.validate(inputData,{abortEarly:false});
        if(validationResult.error){
            return next(new Error(validationResult.error));
        }else{
            next();
        }
    }
}
