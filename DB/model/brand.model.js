import mongoose, { Schema, Types, model } from "mongoose";
const brandSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});
const barandModel = mongoose.models.Brand || model('Brand',brandSchema);
export default barandModel;