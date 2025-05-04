import mongoose from "mongoose";

const ConvertjobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  inputFile: { type: String },
  outputFile: { type: String },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  
},{ timestamps: true });

const Convertjob = mongoose.model("Convertjob", ConvertjobSchema);