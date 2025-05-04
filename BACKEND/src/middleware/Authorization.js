import { auth } from '../../firebaseconfig.js';

/**
 * Middleware to verify Firebase ID tokens stored in cookies
 * Extracts the token from the request cookies and verifies it
 * If valid, attaches the decoded user data to the request object
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.authToken
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No session found'
      });
    }
    
    try {
      // Verify the token with Firebase Admin
      const decodedToken = await auth.verifyIdToken(token);
      
      // Check if the token is not expired
      // Firebase tokens usually expire after 1 hour
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Session expired'
        });
      }
      
      // Attach the user data to the request object
      req.user = decodedToken;
      
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Return appropriate error based on the verification failure
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Session expired'
        });
      } else if (error.code === 'auth/id-token-revoked') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Session revoked'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid session'
        });
      }
    }
  } catch (error) {
    console.error('Authorization middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};