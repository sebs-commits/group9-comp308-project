import NewsModel from "../models/news.server.model.js";

export const newsResolvers = {
  Query: {
    allNews: async () => {
      try {
        const news = await NewsModel.find({});
        return news.map((item) => {
          const plainItem = item.toObject();
          if (plainItem.creationDate) {
            plainItem.creationDate = plainItem.creationDate.toISOString();
          }
          return plainItem;
        });
      } catch (error) {
        console.error(`An error occurred while fetching news`, error);
        throw new Error("Error in news query - news.server.resolver.js");
      }
    },

    news: async (_, { _id }) => await NewsModel.findOne({ _id }),
  },

  Mutation: {
    createNews: async (_, { creatorId, headline, textBody }) => {
      try {
        const newNews = new NewsModel({
          creatorId,
          headline,
          textBody,
          // creationDate will be automatically set by the model's default value
        });
        return await newNews.save();
      } catch (error) {
        console.error(`An error occurred while creating a news: `, error);
        throw new Error("Error in createNews - news.server.resolver.js");
      }
    },

    updateNews: async (_, { _id, creatorId, headline, textBody }) => {
      try {
        const existingNews = await NewsModel.findOne({ _id });
        if (!existingNews)
          throw new Error("You are trying to update a non-existent news.");

        return await NewsModel.findByIdAndUpdate(
          _id,
          { creatorId, headline, textBody },
          { new: true }
        );
      } catch (error) {
        console.error(`An error occurred while updating a news: `, error);
        throw new Error("Error in updateNews - news.server.resolver.js");
      }
    },

    deleteNews: async (_, { _id }) => {
      try {
        return await NewsModel.findByIdAndDelete(_id);
      } catch (error) {
        console.error(`An error occurred while deleting a news: `, error);
        throw new Error("Error in deleteNews - news.server.resolver.js");
      }
    },
  },
};
