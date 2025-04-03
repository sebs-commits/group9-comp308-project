import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },

    email: { type: String, required: true },

    type: {
        type: String,
        enum: {
            values: [ 'resident', 'owner', 'organizer' ],
            message: '{VALUE} is not supported'
        },
        required: true
    },

    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;