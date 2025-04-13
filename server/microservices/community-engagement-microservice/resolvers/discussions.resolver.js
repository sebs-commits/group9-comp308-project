import DiscussionModel from "../models/discussions.server.model.js";
import mongoose from "mongoose";

const formatDiscussionDates = (discussion) => {
  if (!discussion) return null;
  const plainDiscussion = discussion.toObject
    ? discussion.toObject()
    : { ...discussion };

  if (plainDiscussion.createdAt) {
    plainDiscussion.createdAt = plainDiscussion.createdAt.toISOString();
  }
  if (plainDiscussion.replies && Array.isArray(plainDiscussion.replies)) {
    plainDiscussion.replies = plainDiscussion.replies.map((reply) => {
      if (reply.createdAt) {
        if (reply._id) {
          reply._id = reply._id.toString();
        }
        reply.createdAt = reply.createdAt.toISOString();
      }
      return reply;
    });
  }
  if (plainDiscussion._id && typeof plainDiscussion._id !== "string") {
    plainDiscussion._id = plainDiscussion._id.toString();
  }
  return plainDiscussion;
};

export const discussionsResolvers = {
  Query: {
    discussions: async () => {
      try {
        const discussions = await DiscussionModel.find({}).sort({
          createdAt: -1,
        });
        return discussions.map(formatDiscussionDates);
      } catch (error) {
        console.error(`Error fetching discussions: `, error);
        throw new Error("Error in discussions query - discussions.resolver.js");
      }
    },
    discussion: async (_, { _id }) => {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid discussion ID format");
      }
      try {
        const discussion = await DiscussionModel.findById(_id);
        return formatDiscussionDates(discussion);
      } catch (error) {
        console.error(`Error fetching discussion with id ${_id}: `, error);
        throw new Error("Error in discussion query - discussions.resolver.js");
      }
    },
    discussionsByNewsId: async (_, { newsId }) => {
      if (!mongoose.Types.ObjectId.isValid(newsId)) {
        throw new Error("Invalid news ID format");
      }
      try {
        const discussions = await DiscussionModel.find({ newsId: newsId }).sort(
          { createdAt: -1 }
        );
        return discussions.map(formatDiscussionDates);
      } catch (error) {
        console.error(
          `Error fetching discussions for newsId ${newsId}: `,
          error
        );
        throw new Error(
          "Error in discussionsByNewsId query - discussions.resolver.js"
        );
      }
    },
  },

  Mutation: {
    createDiscussion: async (_, { title, description, creatorId, newsId }) => {
      if (newsId && !mongoose.Types.ObjectId.isValid(newsId)) {
        throw new Error("Invalid news ID format provided for discussion");
      }
      try {
        const newDiscussionData = {
          title,
          description,
          creatorId,
          ...(newsId && { newsId: newsId }),
        };
        const newDiscussion = new DiscussionModel(newDiscussionData);
        const savedDiscussion = await newDiscussion.save();
        return formatDiscussionDates(savedDiscussion);
      } catch (error) {
        console.error(`Error creating discussion: `, error);
        throw new Error(
          "Error in createDiscussion mutation - discussions.resolver.js"
        );
      }
    },
    updateDiscussion: async (_, { _id, title, description }) => {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid discussion ID format for update");
      }
      try {
        const updatedDiscussion = await DiscussionModel.findByIdAndUpdate(
          _id,
          { title, description },
          { new: true }
        );
        if (!updatedDiscussion) {
          throw new Error("Discussion not found for update");
        }
        return formatDiscussionDates(updatedDiscussion);
      } catch (error) {
        console.error(`Error updating discussion ${_id}: `, error);
        throw new Error(
          "Error in updateDiscussion mutation - discussions.resolver.js"
        );
      }
    },
    deleteDiscussion: async (_, { _id }) => {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid discussion ID format for delete");
      }
      try {
        const deletedDiscussion = await DiscussionModel.findByIdAndDelete(_id);
        if (!deletedDiscussion) {
          throw new Error("Discussion not found for deletion.");
        }
        return formatDiscussionDates(deletedDiscussion);
      } catch (error) {
        console.error(`Error deleting discussion ${_id}: `, error);
        throw new Error(
          "Error in deleteDiscussion mutation - discussions.resolver.js"
        );
      }
    },
    addReplyToDiscussion: async (_, { discussionId, creatorId, text }) => {
      if (!mongoose.Types.ObjectId.isValid(discussionId)) {
        throw new Error("Invalid discussion ID format for adding reply");
      }
      try {
        const discussion = await DiscussionModel.findById(discussionId);
        if (!discussion) {
          throw new Error("Discussion not found.");
        }

        const newReply = {
          creatorId,
          text,
        };

        discussion.replies.push(newReply);
        const updatedDiscussion = await discussion.save();
        return formatDiscussionDates(updatedDiscussion);
      } catch (error) {
        console.error(
          `Error adding reply to discussion ${discussionId}: `,
          error
        );
        throw new Error(
          "Error in addReplyToDiscussion mutation - discussions.resolver.js"
        );
      }
    },
  },
};
