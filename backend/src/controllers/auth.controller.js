import cloudinary from "../lib/cloudinary.js";
import { gentoken } from "../lib/utils.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs"
// Helper function to generate token


export const signup = async (req, res) => {
    const { name, email, password } = req.body; // Destructure from req.body
    
    try {
      // Validation
      if (!password || !name || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user with default online status (false)
      const newUser = await User.create({
        email,
        fullName: name, // Map 'name' from request to 'fullName' in model
        password: hashedPassword,
        profilePic: "", // Default empty string as per model
        isOnline: true // Default to offline on signup
      });
  
      // Generate token and send response
      gentoken(newUser._id, res);
      
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        isOnline: newUser.isOnline
      });
  
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ 
        message: error.message || "Internal server error" 
      });
    }
  };
  

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Generate token and send response
    gentoken(user._id, res);
    
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isOnline: user.isOnline
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: error.message || "Internal server error" 
    });
  }
};
export const logout = async(req, res) => {
    try {
        // await User.findByIdAndUpdate(req.user._id, {
        //     isOnline: false,
        //     lastSeen: new Date()
        //   });
        res.cookie("jwt", "", {
            maxAge: 0, // Expire the cookie immediately
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
