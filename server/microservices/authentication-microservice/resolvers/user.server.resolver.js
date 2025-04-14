import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/user.server.model.js"

const JWT_SECRET = "some_secret_key";

export const userResolvers = {
    Query: {
        _microservice: () => "This is a micro service query",

        users: async () => {
            try {
                const users = await UserModel.find();
                console.log("Users: ", users);
                return users;
            } catch(error) {
                console.error(`An error occurred while fetching users`, error);
                throw new Error("Error in user query - user.server.resolver.js");
            }
        },

        user: async (_, { id }) => {
            console.log(id);
            try {
                const userFound = await UserModel.findById(id);
                console.log("UserFound: ", userFound);

                return userFound;
            } catch(error) {
                console.error(`An error occurred while getting a user: `, error);
                throw new Error("Error in user - user.server.resolver.js");
            }            
        },

        getUserByUsername: async (_, { username }) => {
            try {
                const userFound = await UserModel.findOne({ username });        
                return userFound ? userFound.username : null;
            } catch (error) {
                console.log(`An error occurred while getting a user by username: `, error);
                throw new Error("Error in getUserByUsername - user.server.resolver.js");
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
                const UserFoundAndUpdated = await UserModel.findByIdAndUpdate(id, { username, email, type }, { new: true });
                console.log("UserFoundAndUpdated: ", userFound);

                return UserFoundAndUpdated;
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
        },

        updateVolunteer: async (_, { id, interests, location, eventMatches, requestMatches, ignoredMatches }) => {
            try {
                await UserModel.findByIdAndUpdate(id, { interests, location, eventMatches, requestMatches, ignoredMatches }, { new: true });
            } catch(error) {
                console.error(`An error occurred while updating a user: `, error);
                throw new Error("Error in updateVolunteer - user.server.resolver.js");
            }
        }
    }
}