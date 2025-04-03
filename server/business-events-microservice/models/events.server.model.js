import mongoose from "mongoose";

const { Schema } = mongoose;

const eventsSchema = new Schema({
    creatorId: { type: String, required: true },//{ type: Schema.Types.ObjectId, ref: "User" }
    
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

    to: { type: String, required: true },

    price: { type: String, required: true },

    location: { type: String, required: true }
})

const EventModel = mongoose.model('Events', eventsSchema);

export default EventModel;

