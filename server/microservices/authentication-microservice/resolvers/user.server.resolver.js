import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/user.server.model.js"

const JWT_SECRET = "some_secret_key";

export const userResolvers = {
    Query: {
        _microservice: () => "This is a micro service query",

        user: async (_, { id }) => {
            try {
                await UserModel.findById(id)
            } catch(error) {
                console.error(`An error occurred while getting a user: `, error);
                throw new Error("Error in user - user.server.resolver.js");
            }            
        }
    },
    
    Mutation: {
        createUser: async (_, { username, email, type, password }) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new UserModel({ username, email, type, password: hashedPassword });
                return await newUser.save();
            } catch(error) {
                console.error(`An error occurred while creating a user: `, error);
                throw new Error("Error in createUser - user.server.resolver.js");
            }            
        },
        updateUser: async (_, { id, username, email, type }) => {
            try {
                await UserModel.findByIdAndUpdate(id, { username, email, type }, { new: true });
            } catch(error) {
                console.error(`An error occurred while updating a user: `, error);
                throw new Error("Error in updateUser - user.server.resolver.js");
            }
        },
        loginUser: async (_, { username, password }, { res }) => {
            if(!res) throw new Error("No res available");

            const user = await UserModel.findOne({ username });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!user || !isPasswordValid) return 'auth';

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

            return [ token, user._id, user.username, user.type ];
        },
        logout: async (_, __, { res }) => {
            return 'Logged out successfully!';
        }
    }
}