import mongoose from "mongoose";

const { Schema } = mongoose;

const locationSchema = new Schema({
    streetNumb: { type: Number, required: true },

    streetType: { 
        type: String,
        enum: {
            values: [ 'street', 'blvd', 'crescent' ],
            message: '{VALUE} is not supported'
        },
        required: true
    },

    streetName: { type: String, required: true },

    city: { type: String, required: true }
})

export default locationSchema;