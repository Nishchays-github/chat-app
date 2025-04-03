import React, { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import useAuthStore from './store/useAuthStore.js';
import {Loader} from 'lucide-react'
const App = () => {
    const { checkAuth,checkingAuth,authUser } = useAuthStore();
    useEffect(() => {
      checkAuth();
    }, [checkAuth]); // Add checkAuth to the dependency array
    
    if(checkingAuth && !authUser){
      return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-ping'/>
    </div>
      );
    }
    return (
        <div data-theme="">
            <Navbar />
            <Routes>
                <Route path='/' element={authUser? <HomePage />:<Navigate to ="/login"/>} />
                <Route path='/login' element={!authUser ?<LoginPage />:<Navigate to ="/"/>} />
                <Route path='/signup' element={!authUser ?<SignUpPage />:<Navigate to ="/"/>} />
                <Route path='/settings' element={<SettingPage />} />
                <Route path='/profile' element={authUser? <ProfilePage />:<Navigate to ="/login"/>} />
            </Routes>
        </div>
    );
};

export default App;