import User from "../models/User.js";

export const saveUser = async(uid,email,name,picture)=>{

    try{
        // Check if user already exists in the database
        const existingUser = await User.findOne({ firebaseId:uid });
        if (existingUser) {
            return { success: true, message: "User already exists", data: existingUser };
        }

        // Create a new user if it doesn't exist
        const newUser = new User({
            firebaseId:uid,
            username:name,
            email: email,
            profilePicture: picture,
        
        });

        await newUser.save();
        return { success: true, message: "User saved successfully", data: newUser };

   }
    catch (error) {
          console.error("Error saving user:", error);
          return { success: false, message: "Error saving user", error };
     }
    



}