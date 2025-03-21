import mongoose from "mongoose";
 const UserSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        unique: true
    },
    fullName:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:""
    },
    
 },{
    timestamps:true,
})
const User = mongoose.model("User",UserSchema);
export default User;