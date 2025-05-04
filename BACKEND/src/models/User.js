import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
 
 
},{ timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;