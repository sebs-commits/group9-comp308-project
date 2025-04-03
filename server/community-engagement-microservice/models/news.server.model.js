import mongoose from "mongoose";

const { Schema } = mongoose;

const newsSchema = new Schema({
    creatorId: { type: String, required: true },//{ type: Schema.Types.ObjectId, ref: "User" }

    headline: { type: String, required: true },        

    summary: { type: String, required: true },

    fullnews: { type: String, required: true },

    creationDate: { type: String, required: true },

    expiryDate: { type: String, required: true }
})

const NewsModel = mongoose.model('News', newsSchema);

export default NewsModel;

