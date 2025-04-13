import mongoose from "mongoose";

const { Schema } = mongoose;

const replySchema = new Schema({
  creatorId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const discussionsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  newsId: {
    type: Schema.Types.ObjectId,
    ref: "News",
    required: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
});

discussionsSchema.index({ creatorId: 1 });

const DiscussionModel = mongoose.model("Discussions", discussionsSchema);

export default DiscussionModel;
