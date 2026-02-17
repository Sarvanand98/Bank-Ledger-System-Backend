import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }

},{
    timestamps:true
})

const userModel=mongoose.model("user",userSchema)

export default userModel;   