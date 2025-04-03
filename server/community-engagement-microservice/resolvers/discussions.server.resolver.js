import DiscussionModel from "../models/discussions.server.model.js";

export const discussionsResolvers = {
  Query: {
    // Get all
    discussions: async () => {
      try {
        const discussions = await DiscussionModel.find();
        return discussions || [];
      } catch (error) {
        console.error(`An error occurred while fetching discussions`, error);
        throw new Error(
          "Error in discussions query - discussions.server.resolver.js"
        );
      }
    },
    discussion: async (_, { _id }) => await DiscussionModel.findOne({ _id }),
  },

  Mutation: {
    // Create
    createDiscussion: async (_, { title, description }) => {
      try {
        const newDiscussion = new DiscussionModel({ title, description });
        return await newDiscussion.save();
      } catch (error) {
        console.error(`An error occurred while creating a discussion: `, error);
        throw new Error(
          "Error in createDiscussion - discussions.server.resolver.js"
        );
      }
    },

    // Update
    updateDiscussion: async (_, { _id, title, description }) => {
      try {
        const existingDiscussion = await DiscussionModel.findOne({ _id });
        if (!existingDiscussion)
          throw new Error(
            "You are trying to update a non-existing discussion."
          );

        return await DiscussionModel.findByIdAndUpdate(_id, {
          title,
          description,
        });
      } catch (error) {
        console.error(`An error occurred while updating a discussion: `, error);
        throw new Error(
          "Error in updateDiscussion - discussions.server.resolver.js"
        );
      }
    },

    // Delete
    deleteDiscussion: async (_, { _id }) => {
      try {
        return await DiscussionModel.findByIdAndDelete(_id);
      } catch (error) {
        console.error(`An error occurred while deleting a discussion: `, error);
        throw new Error(
          "Error in deleteDiscussion - discussions.server.resolver.js"
        );
      }
    },
  },
};
