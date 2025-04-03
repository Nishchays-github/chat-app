import { create } from "zustand";
import { instance } from "../lib/axios.js";
import toast from 'react-hot-toast';
import useAuthStore from "./useAuthStore.js";
const useChatStore = create((set,get)=>({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: null,
  isMessagesLoading: null,
  onlineUsers: [], 
  
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await instance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load messages');
        // Clear messages on error
      } finally {
        set({ isMessagesLoading: false });
      }
    },

  sendMessage: async (messageData) => {
  try {
    const { selectedUser, getMessages } = get();
    await instance.post(`/messages/send/${selectedUser._id}`, messageData);
    
    // Re-fetch messages to ensure the UI is up-to-date
    const res = await getMessages(selectedUser._id);
    set({messages:res.data})
    toast.success("Message sent successfully");
    return true;
  } catch (error) {
    toast.error("Failed to send message");
    return false;
  }
    },
    getLivemessages:(messageData)=>{
      const {selectedUser} = get();
      if(!selectedUser) return ;
      const socket = useAuthStore.getState().socket;
      socket.on('newMessage',(newmessage)=>{
        set({
          messages:[...get().messages,newmessage],
        })
      })
    },
    offmessages:()=>{
      const socket = useAuthStore.getState().socket;
      socket.off('newMessage');
    },
    setSelectedUser: (user) => set({ selectedUser: user }),
    setOnlineUsers: (users) => set({ onlineUsers: users })
}));

export default useChatStore;