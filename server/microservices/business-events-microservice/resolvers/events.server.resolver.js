import { getToday } from "../../../shared/utils.js";
import EventModel from "../models/events.server.model.js";

export const eventsResolvers = {
    Query: {
        events: async () => {
            try {
                const today = getToday();
                const events = await EventModel.find({to: { $gte: today }});
                return events || [];
            } catch(error) {
                console.error(`An error occurred while fetching events`, error);
                throw new Error("Error in events query - events.server.resolver.js");
            }
        },

        userEvents: async (_, { creatorId }) => {
            try {
                const events = await EventModel.find({creatorId});
                return events || [];
            } catch(error) {
                console.error(`An error occurred while fetching the user events`, error);
                throw new Error("Error in user events query - events.server.resolver.js");
            }
        },

        event: async (_, { _id }) => await EventModel.findOne({ _id })
    },

    Mutation: {
        createEvent: async (_, { creatorId, title, description, summary, type, from, to, price, location }) => {
            try {
                const newEvent = new EventModel({ creatorId, title, description, summary, type, from, to, price, location });
                return await newEvent.save();
            } catch(error) {
                console.error(`An error occurred while creating an event: `, error);
                throw new Error("Error in createEvent - events.server.resolver.js");
            }            
        },

        updateEvent: async (_, { id, creatorId, title, description, summary, type, from, to, price, location }) => { 
            try {
                const existingEvent = await EventModel.findOne({ _id: id });
                if(!existingEvent)
                    throw new Error("You are trying to update a non-existent event.")

                return await EventModel.findByIdAndUpdate(id, { creatorId, title, description, summary, type, from, to, price, location });
            } catch(error) {
                console.error(`An error occurred while updating an event: `, error);
                throw new Error("Error in updateEvent - events.server.resolver.js");
            }            
        },
        
        deleteEvent: async (_, { id }) => {
            try {
                return await EventModel.findByIdAndDelete({_id: id});                
            } catch(error) {
                console.error(`An error occurred while deleting an event: `, error);
                throw new Error("Error in deleteEvent - events.server.resolver.js");
            }
        }
    }
}