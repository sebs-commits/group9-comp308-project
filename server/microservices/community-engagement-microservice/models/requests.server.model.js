import mongoose from "mongoose";

const { Schema } = mongoose;

const requestsSchema = new Schema({
    creatorId: { type: String, required: true },//{ type: Schema.Types.ObjectId, ref: "User" }
    
    title: { type: String, required: true },

    type: { 
        type: String,
        enum: {
            values: [ 'help', 'maintenance', 'accommodation', 'donation' ],
            message: '{VALUE} is not supported'
        },
        required: true
    },
    
    request: { type: String, required: true }
})

const RequestModel = mongoose.model('Requests', requestsSchema);

export default RequestModel;

