import { useState, useEffect } from 'react';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { app } from '../../firebaseconfig.js';
import api from '../../axiosconfig.js'

// Initialize Firebase auth and provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const GoogleLogin = ({ onLoginChange }) => {
  const [user, setUser] = useState(null);
 

  useEffect(() => {
    // Set up auth state listener
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Get ID token if user is logged in
      if (currentUser) {
        console.log(currentUser)
        try {
          const token = await currentUser.getIdToken(true);
         
          // Store token in localStorage for persistence
          localStorage.setItem('user',currentUser);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      } else {
        // Clear token when logged out
       
        localStorage.removeItem('user');
      }
      
      // Call the callback to inform parent components
      if (onLoginChange) {
        onLoginChange(currentUser)
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      // Get ID token right after login
      const token = await result.user.getIdToken(true);
      console.log("Token:", token);
     
      const response = await api.post('/auth/login', {token:token });
      if(response.status === 200)
      {
        console.log("Login successful:", response.data);
        // Store user data from the response, not from result.data
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      else
      {
        console.error("Login failed:", response.data);
      }

    } catch (error) {

      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
     
      const response = await api.post('/auth/logout');
      if(response.status === 200)
      {
        console.log("Logout successful:", response.data);
      }
      else
      {
        console.error("Logout failed:", response.data);
      }
     
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper function to get ID token for API calls
  // const getIdToken = async () => {
  //   if (user) {
  //     try {
  //       const token = await user.getIdToken(true);
      
  //       return token;
  //     } catch (error) {
  //       console.error("Error refreshing token:", error);
  //       return null;
  //     }
  //   }
  //   return idToken;
  // };

  // Export these functions to be used by parent components
  return {
    user,
    
    handleGoogleLogin,
    handleLogout
  };
};

export default GoogleLogin;