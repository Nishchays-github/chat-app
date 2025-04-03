import User from "../models/users.model.js";
export const removeonlineusers = async (userId) => { // Now takes userId directly
  try {
    const user = await User.findByIdAndUpdate(
      userId, // Changed from req.user._id
      { 
        isOnline: false,
        lastSeen: Date.now()
      },
      { new: true }
    ).select('-password');

    
    // No response needed for Socket.IO
    return user;
  } catch (error) {
    console.error("Error marking user offline:", error);
    throw error; // Let Socket.IO handle errors
  }
};

export const getusers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } } // Exclude current user
    ).select('-password -__v -createdAt -updatedAt'); 
    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        isOnline: user.isOnline,
        lastSeen:user.lastSeen
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users"
    });
  }
};