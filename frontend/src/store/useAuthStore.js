import { create } from 'zustand';
import { instance } from "../lib/axios.js"; // Use curly braces for named export
import toast from 'react-hot-toast';
import {io} from 'socket.io-client' 
const BASE_URL = 'http://localhost:5001'
const useAuthStore = create((set,get) => ({
    userId:null,
    authUser: null,
    checkingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,
    allusers:null,
    checkAuth: async () => {
        try {
            const res = await instance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ checkingAuth: false });
        }
    },
    signUp: async (data) => {
        set({ isSigningUp: true });
        try { // Log the data
            const res = await instance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Signup error:", error.response?.data); // Log the error response
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isSigningUp: false });
        }
    },
    logiIn: async(data)=>{
        try {
            set({isLoggingIn: true});
            const res = await instance.post('/auth/login',data);
            set({authUser:res.data});
            set({userId:res.data._id});
            get().connectSocket();
            toast.success("successfully logged in");
            
        } catch (error) {
            toast.error("an error occured");            
        }
        finally{
            set({isLoggingIn: false});
        }
    },
    logout: async () => {
        try {
            get().disconnectSocket(); // Disconnect socket first
            await instance.post('/auth/logout');
            toast.success("Successfully logged out");
            set({ authUser: null, userId: null });
        } catch (error) {
            toast.error("An error occurred");
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await instance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
    },
    connectSocket: async()=>{
        const {authUser} = get();
        if(!authUser && get().socket?.connected) return ;
        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            }
        });
        const{getonlineusers,userslist} = get();
        getonlineusers();
        userslist();
        socket.connect();
        set({socket:socket});
    },
    disconnectSocket: async() => {
        const{getonlineusers,userslist,authUser} = get();
        const res = await instance.put("/auth/remove-online-user", authUser._id);
        getonlineusers();
        userslist();
        if(get().socket?.connected) get().socket.disconnect();
    },
    userslist: async()=>{
        const {authUser} = get();
        const res = await instance.get("/auth/users", authUser._id);
        set({allusers:res.data.data});
    },
    getonlineusers:async()=>{
        const {onlineUsers,authUser} = get();
        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            }
        });
        socket.on('getOnlineUsers',(userIds)=>{
            set({onlineUsers:userIds});
        })
    }

}));

export default useAuthStore;