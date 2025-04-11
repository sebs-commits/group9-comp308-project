import mongoose from "mongoose";

const { Schema } = mongoose;

const discussionsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Eventually add userId and reference to user model
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DiscussionModel = mongoose.model("Discussions", discussionsSchema);

export default DiscussionModel;
