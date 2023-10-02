export const asyncHandller =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(error=>{
            return next(new Error(error,{cause:500}));
        });
    }
}
export const globalErrorHandller =(err,req,res,next)=>{
    if(err){
        if(process.env.MOOD == 'DEV'){
            return res.status(err.cause || 500).json({message:"catch error", error:err.message});
        }else{
            return res.status(500).json({message:"catch error"});
        }
        }
}
