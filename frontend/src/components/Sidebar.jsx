import { useEffect, useState } from "react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton.jsx";
import { Users } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";
import useChatStore from "../store/useChatStore.js";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, getMessages } = useChatStore();
  const { onlineUsers, isLoading, userslist, allusers, getonlineusers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    userslist();
    getonlineusers();
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [userslist, getonlineusers, selectedUser, getMessages]);

  // Safe handling of potentially null/undefined allusers
  const usersWithOnlineStatus = allusers 
    ? allusers.map(user => ({
        ...user,
        isOnline: onlineUsers?.includes(user._id) || false
      }))
    : [];
  const filteredUsers = showOnlineOnly
    ? usersWithOnlineStatus.filter(user => user.isOnline)
    : usersWithOnlineStatus;

  const onlineCount = usersWithOnlineStatus.filter(user => user.isOnline).length;

  if (isLoading || !allusers) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineCount} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {user.isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No contacts available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;