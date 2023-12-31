import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    about:{type:String},
    tags:{type:[String]},
    joinedOn:{type:Date, default:Date.now},
    subscription:{type:String, default:'FREE'},
    badges:{type:[String]},
    points:{type:Number,default:0},
})

export default mongoose.model("User",userSchema)