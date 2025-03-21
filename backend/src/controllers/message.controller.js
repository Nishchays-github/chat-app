import User from "../models/users.model.js";
import messages from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";
export const sidebar = async(req,res)=>{
    try {
        const loggeduserid = req.body._id;
        const users = User.find({_id: {$ne:loggeduserid}}).select("-password");
        res.status(200).json({message: "got side bar"});
        
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
}
export const getMessage = async(req,res)=>{
    try {
        const {id:usertochatid} = req.params;
        const myId = req.user._id;
        const message = await messages.find({
            $or:[
                {senderId:myId, receiverId:usertochatid},
                {receiverId:myId, senderId:usertochatid},
            ]
        })
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({message: " internal server error"});
        
    }
    
}

export const sendMessage = async(req,res)=>{
    try{
    const {text, image} = req.body;
    const {id:receiverId} = req.params;
    const userid = req.user._id;
    let imgurl;
    const uploadres = await cloudinary.uploader.upload(image);
    imgurl = uploadres.secure_url;
    const newMess = {
        senderId:userid,
        receiverId:receiverId,
        text,
        image:imgurl
    }
    await newMess.save();
}
catch(error){
    res.status(201).json({message: " intenrla server error"});
}
}