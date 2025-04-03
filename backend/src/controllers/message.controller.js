import User from "../models/users.model.js";
import messages from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getsocketid,io } from "../lib/socket.js";
export const sidebar = async (req, res) => {
    try {
        const loggedUserId = req.body._id;

        // Fetch all users except the logged-in one, selecting only needed fields
        const users = await User.find(
            { _id: { $ne: loggedUserId } },
            { fullName: 1, profilePic: 1, _id: 1 }
        ).lean(); 

        // Transform the data to simpler format
        const simplifiedUsers = users.map(user => ({
            id: user._id,
            name: user.fullName,
            avatar: user.profilePic
        }));

        
        res.status(200).json({
            message: "Successfully fetched sidebar data",
            users: simplifiedUsers
        });
        
    } catch (error) {
        console.error('Error in sidebar function:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
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

export const sendMessage = async(req, res) => {
    try {
        const { text, image } = req.body;
        const {id:receiverId } = req.params;
        const userId = req.user._id;
        let imgUrl = "";

        // Handle image upload if present
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image);
            imgUrl = uploadRes.secure_url;
        }

        // Create a new message using the Message model
        const newMessage = new messages({
            senderId: userId,
            receiverId:receiverId,
            text,
            image: imgUrl
        });
        // Save to MongoDB
        await newMessage.save();
        const receiverIdsocket = getsocketid(receiverId);
        if(receiverIdsocket){
            io.to(receiverId).emit('newMessage',newMessage);
        }
        res.status(201).json({ 
            message: "Message sent successfully",
            data: newMessage 
        });
        
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }

}