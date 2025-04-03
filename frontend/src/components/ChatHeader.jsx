import { X } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";
import useChatStore from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, allusers } = useAuthStore();
  // Safely find user data
  const currentUser = allusers?.find(user => user._id === selectedUser?._id) || selectedUser;
  const isOnline = onlineUsers?.includes(selectedUser?._id);
  const lastSeen = currentUser?.lastSeen;

  // Format last seen time
  const formatLastSeen = (dateString) => {
    if (!dateString) return "Unknown";
    
    try {
      const lastSeenDate = new Date(dateString);
      const now = new Date();
      const diffHours = Math.floor((now - lastSeenDate) / (1000 * 60 * 60));

      if (isNaN(lastSeenDate.getTime())) return "Unknown";

      if (diffHours < 24) {
        return `Last seen today at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffHours < 48) {
        return `Last seen yesterday at ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return `Last seen ${lastSeenDate.toLocaleDateString()}`;
      }
    } catch (e) {
      return "Unknown";
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="size-10 rounded-full">
              <img 
                src={currentUser?.profilePic || "/avatar.png"} 
                alt={currentUser?.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          
          {/* User info */}
          <div>
            <h3 className="font-medium">{currentUser?.fullName || "Unknown User"}</h3>
            <p className="text-sm text-base-content/70">
              {isOnline ? "Online" : formatLastSeen(lastSeen)}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-1 rounded-full hover:bg-base-300 transition-colors"
          aria-label="Close chat"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;