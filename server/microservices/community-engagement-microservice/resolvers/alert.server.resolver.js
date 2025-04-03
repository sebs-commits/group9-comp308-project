import AlertModel from "../models/alert.server.model.js";

export const alertResolvers = {
    Query: {
        alerts: async () => {
            try {
                const alerts = await AlertModel.find();
                return alerts || [];
            } catch(error) {
                console.error(`An error occurred while fetching alerts`, error);
                throw new Error("Error in alerts query - alert.server.resolver.js")
            }
        },

        alert: async (__dirname, { _id }) => await AlertModel.findOne({ _id })
    },

    Mutation: {
        createAlert: async (_, { creatorId, title, subtitle }) => {
            try {
                const newAlert = new AlertModel({ creatorId, title, subtitle });
                return await newAlert.save();
            } catch(error) {
                console.error(`An error occurred while creating a new alert`, error);
                throw new Error("Error in createAlert - alert.server.resolver.js");
            }
        },

        updateAlert: async(_, { _id, creatorId, title, subtitle }) => {
            try {
                const existingAlert = await AlertModel.findOne({ _id });
                if(!existingAlert)
                    throw new Error("You are trying to update a non-existing alert.");

                return await AlertModel.findByIdAndUpdate(_id, { creatorId, title, subtitle });
            } catch(error) {
                console.error(`An error occurred while updating an alert`, error);
                throw new Error("Error in updateAlert - alert.server.resolver.js");
            }
        },

        deleteAlert: async(_, { _id }) => {
            try {
                return await AlertModel.findByIdAndDelete(_id);
            } catch(error) {
                console.error(`An error occurred while deleting an alert`, error);
                throw new Error("Error in deleteAlert - alert.server.resolver.js");
            }
        }
    }
}