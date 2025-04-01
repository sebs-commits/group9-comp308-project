import mongoose from "mongoose";

const { Schema } = mongoose;

const alertSchema = new Schema({
    creatorId: { type: String, required: true }, //{ type: Schema.Types.ObjectId, ref: "User" }

    title: { type: String, required: true },

    subtitle: { type: String, required: true }
    
})

const AlertModel = mongoose.model('Alert', alertSchema);

export default AlertModel;