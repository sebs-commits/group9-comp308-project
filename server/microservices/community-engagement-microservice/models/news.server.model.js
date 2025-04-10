import mongoose from "mongoose";

const { Schema } = mongoose;

const newsSchema = new Schema({
  creatorId: { type: String, required: true }, //{ type: Schema.Types.ObjectId, ref: "User" }

  headline: { type: String, required: true },

  textBody: { type: String, required: true },

  creationDate: { type: Date, default: Date.now, required: true },
  image: { type: String, required: false }
});

const NewsModel = mongoose.model("News", newsSchema);

export default NewsModel;
