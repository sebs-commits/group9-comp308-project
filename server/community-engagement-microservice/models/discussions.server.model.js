import mongoose from "mongoose";

const { Schema } = mongoose;

const discussionsSchema = new Schema({
   
})

const DiscussionModel = mongoose.model('Discussions', discussionsSchema);

export default DiscussionModel;

