import mongoose from "mongoose";
import locationSchema from "./location.server.schema.js";
import organizerSchema from "./organizer.server.schema.js";

const { Schema } = mongoose;

const eventsSchema = new Schema({
    title: { type: String, required: true },
    
    description: { type: String, required: true },

    summary: { type: String, required: true },

    type: { 
        type: String,
        enum: {
            values: [ 'workshops', 'meetups', 'clean-up-drives' ],
            message: '{VALUE} is not supported'
        },
        required: true
    },

    from: { type: String, required: true },

    to: { type: String },

    price: { type: Number },

    location: locationSchema,

    organizer: organizerSchema

})

const EventModel = mongoose.model('Events', eventsSchema);

export default EventModel;

