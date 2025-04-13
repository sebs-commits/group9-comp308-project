import RequestModel from "../models/requests.server.model.js";

export const requestsResolvers = {
  Query: {
    requests: async () => {
      try {
        const requests = await RequestModel.find();
        return requests || [];
      } catch (error) {
        console.error(`An error occurred while fetching requests`, error);
        throw new Error(
          "Error in requests query - requests.server.resolver.js"
        );
      }
    },
    request: async (_, { _id }) => await RequestModel.findOne({ _id }),

    userRequests: async (_, { creatorId }) => {
      try {
        const userRequests = await RequestModel.find({ creatorId });
        return userRequests || [];
      } catch (error) {
        console.error(`An error occurred while fetching user requests`, error);
        throw new Error(
          "Error in userRequests query - requests.server.resolver.js"
        );
      }
    },
  },

  Mutation: {
    createRequest: async (_, { creatorId, title, type, request, location }) => {
      try {
        const newRequest = new RequestModel({
          creatorId,
          title,
          type,
          request,
          location,
        });
        return await newRequest.save();
      } catch (error) {
        console.error(`An error occurred while creating a request: `, error);
        throw new Error("Error in createRequest - requests.server.resolver.js");
      }
    },

    updateRequest: async (
      _,
      { _id, creatorId, title, type, request, location }
    ) => {
      try {
        const existringRequests = await RequestModel.findOne({ _id });
        if (!existringRequests)
          throw new Error("You are trying to update a non-existing request.");

        return await RequestModel.findByIdAndUpdate(
          _id,
          { creatorId, title, type, request, location },
          { new: true }
        );
      } catch (error) {
        console.error(`An error occurred while updating a request: `, error);
        throw new Error("Error in updateRequest - requests.server.resolver.js");
      }
    },

    deleteRequest: async (_, { _id }) => {
      try {
        return await RequestModel.findByIdAndDelete(_id);
      } catch (error) {
        console.error(`An error occurred while deleting a request: `, error);
        throw new Error("Error in deleteRequest - requests.server.resolver.js");
      }
    },
  },
};
