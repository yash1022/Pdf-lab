import { useState, useEffect } from 'react';
import GoogleLogin from '../Auth/GoogleLogin';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  
  const navigate = useNavigate();
 
  const { user, handleGoogleLogin, handleLogout } = GoogleLogin({
    onLoginChange: (currentUser) => {
      setIsLoggedIn(!!currentUser);
      setUserProfile(currentUser);
    }
  });

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      handleGoogleLogin();
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md border-b border-gray-500">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Title */}
        <div className="text-xl font-bold">PDF Lab</div>
        
        {/* PDF Operation Buttons */}
        <div className="flex items-center space-x-4 ml-8">
          <button className="px-4 py-2 rounded-md transition duration-300 ease-in-out hover:text-green-400" onClick={() => navigate('/summarize')}>
            Summarize
          </button>
          <button className="px-4 py-2 rounded-md transition duration-300 ease-in-out hover:text-purple-400" onClick={() => navigate('/merge')}>
            Merge
          </button>
          <button className="px-4 py-2 rounded-md transition duration-300 ease-in-out hover:text-yellow-400" onClick={() => navigate('/convert')}>
            Convert
          </button>
          <button className="px-4 py-2 rounded-md transition duration-300 ease-in-out hover:text-blue-400" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <div className="relative">
            {isLoggedIn && userProfile ? (
              <img 
                src={userProfile.photoURL || "https://via.placeholder.com/40"}
                alt="Profile" 
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                title={userProfile.displayName || "User"}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Login Button */}
          <button 
            onClick={handleLoginClick}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            {isLoggedIn ? 'Logout' : 'Login with Google'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;