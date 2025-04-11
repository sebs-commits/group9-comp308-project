import mongoose from "mongoose";

const { Schema } = mongoose;

const alertSchema = new Schema({
    creatorId: { type: String, required: true },

    title: { type: String, required: true },

    subtitle: { type: String, required: true },

    createdAt: { type: Date, default: Date.now }
    
})

const AlertModel = mongoose.model('Alert', alertSchema);

export default AlertModel;