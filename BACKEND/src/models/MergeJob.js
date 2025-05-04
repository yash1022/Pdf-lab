import mongoose from 'mongoose';

const MergeJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inputFiles: [{ type: String }],
  outputFile: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const MergeJob = mongoose.model('MergeJob', MergeJobSchema);

export default MergeJob;