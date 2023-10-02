import mongoose,{ Schema, Types, model } from "mongoose";
const userSchema = new Schema({
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
    },
    userName:{
        type:String,
        required:[true,'username is required'],
        min:[2],
        max:[20]
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:Object
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    gender:{
        type:String,
        enum:['Male','Female']
    },
    role:{
        type:String,
        enum:['User','Admin'],
        default:'User'
    },
    status:{
        type:String,
        enum:['Active','Not_Active'],
        default:'Active'
    },
    forgetCode:{
        type:String,
        default:null
    },
    changePasswordTime:{
        type:Date
    },
    wishList:[{
        type:Types.ObjectId,
        ref:'Product',
    }]
},
    {timestamps:true});
const userModel = mongoose.models.User || model('User',userSchema);
export default userModel;