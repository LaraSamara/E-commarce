import mongoose,{Schema,Types,model} from "mongoose";
const subcategorySchema = new Schema({
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
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
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
    }
},{timestamps:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}});
subcategorySchema.virtual('product',{
    localField:'_id',
    foreignField:'subCategoryId',
    ref:'Product'
})
const subcategoryModel = mongoose.models.Subcategory || model('Subcategory',subcategorySchema);
export default subcategoryModel;