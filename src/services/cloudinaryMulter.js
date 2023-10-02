import multer from "multer";
export const fileValidation ={
    image:['image/png','image/gif','image/jpeg'],
    file:['application/pdf']
}
export function fileUpload(customeValidation=[]){
    const storage = multer.diskStorage({});
    function fileFilter(req,file,cb){
        if(customeValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb('invalid format',false);
        }
    }
    const upload = multer({fileFilter,storage});
    return upload;
}