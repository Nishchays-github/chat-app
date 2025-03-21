import cloudinary from "../lib/cloudinary.js";
import { gentoken } from "../lib/utils.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs"
export const signup = async(req,res)=>{
    const {email,fullName,password} = req.body;
    try{
        if(!password || !fullName || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"password should be atleast 6 characters"})
        }
        const user = await User.findOne({ email: email });
        if(user) {
            return res.status(400).json({message:"user exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password,salt);
        const newuser =new User ({
            email,
            fullName,
            password: hashedpass,
        });
        if(newuser){
            // gen jwt tokem
            gentoken(newuser._id,res);
            await newuser.save();;

            res.status(201).json({
                _id: newuser._id,
                fullName:newuser.fullName,
                email:newuser.email,
                profilePic:newuser.profilePic,
            })
        }
        else{
             res.status(400).json("invalid user data");
        }
    }
    catch(error){
        res.status(400).json({message: "internal server error"});
    }
};
export const login = async(req,res)=>{
    try{
        const {email,fullName,password} = req.body;
        const user = await User.findOne({ email: email });
        if(!user){
            res.status(404).json({message: "invalid credentials"});
        }
        const passcheck = await bcrypt.compare(password,user.password);
        if(!passcheck){
            res.status(404).json({message: "invalid credentials"});
        }
        gentoken(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email:user.email,
            profilePic:user.profilePic
        });
    }
    catch(error){
        console.log("error in login controller", error.message);
        res.status(500).json({message:"internal server error"});
    }
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0, // Expire the cookie immediately
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile =async(req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            res.status(404).json({message: "profile pic is required"});
        }
        const uploadres = cloudinary.uploader.upload(profilePic);
        const updateduser  = await User.findByIdAndUpdate({profilePic:(await uploadres).secure_url},{new:true});
        res.status(200).json({message:"user updated successfully"});
    }
    catch(error){
        res.status(500).json({message: "internal sever error "});
    }

}   

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
