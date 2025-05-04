import express from 'express';
import User from '../models/User.js';
import { auth } from '../../firebaseconfig.js';
import { saveUser } from '../controllers/auth.js';
import { verifyFirebaseToken } from '../middleware/Authorization.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { token } = req.body;
  
  
  if (!token) {
    return res.status(400).json({ message: 'ID token is required' });
  }
 
  try {
    
    const decodedToken = await auth.verifyIdToken(token);


    if (!decodedToken) {

      console.log('Invalid ID token:', token);
    }
 
    const decoded = typeof decodedToken === 'string' ? JSON.parse(decodedToken) : decodedToken;

    console.log('Decoded token:', decoded);
    
  
    const { uid, email, name, picture } = decoded;

    const response = await saveUser( uid, email, name, picture );
    if(response.success)
    {
     console.log(response.message);
      return res.cookie('authToken', token,  { 
        httpOnly: true,       // Not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'Lax',      // Less strict than 'Strict' but still secure
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }).status(200).json({ message: response.message, user: response.data});

     
    }
    else
    {
      console.error("User saving failed:", response.data);
       return res.status(500).json({ message: 'User saving failed', error: response.error });
    }

  }
  catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
    
});

// POST /api/auth/logout - Log out a user
router.post('/logout',verifyFirebaseToken, (req, res) => {
  console.log('Logging out user:', req.user.uid);
  
  console.log(req.status)
  res.clearCookie('authToken', { httpOnly: true, sameSite: 'Strict' });

  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;