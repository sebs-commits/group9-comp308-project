import mongoose from "mongoose";

const { Schema } = mongoose;

const organizerSchema = new Schema({
    organizerId: { type: String, required: true },    

    name: { type: String, required: true },

    phoneNumber: { type: String, required: true },

    email: { type: String, required: true }
})

export default organizerSchema;