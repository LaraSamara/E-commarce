import mongoose from "mongoose";
export const connectDB =()=>{
    return mongoose.connect(process.env.Local_DB);
}