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

    news: async (_, { _id }) => {
      try {
        const item = await NewsModel.findOne({ _id });
        if (item) {
          const plainItem = item.toObject();
          if (plainItem.creationDate) {
            plainItem.creationDate = plainItem.creationDate.toISOString();
          }
          return plainItem;
        }
        return null;
      } catch (error) {
        console.error("Error occurred fetching this news item", error);
        throw new Error("Error in news query - news.server.resolver.js");
      }
    },
  },

  Mutation: {
    createNews: async (_, { creatorId, headline, textBody, image }) => {
      try {
        const newNews = new NewsModel({
          creatorId,
          headline,
          textBody,
          image,
          // creationDate will be automatically set by the model's default value
        });
        return await newNews.save();
      } catch (error) {
        console.error(`An error occurred while creating a news: `, error);
        throw new Error("Error in createNews - news.server.resolver.js");
      }
    },

    updateNews: async (_, { _id, creatorId, headline, textBody, image }) => {
      try {
        const existingNews = await NewsModel.findOne({ _id });
        if (!existingNews)
          throw new Error("You are trying to update a non-existent news.");

        const updateData = { creatorId, headline, textBody };
        if (image !== undefined) {
          updateData.image = image;
        }

        return await NewsModel.findByIdAndUpdate(_id, updateData, {
          new: true,
        });
      } catch (error) {
        console.error(`An error occurred while updating a news `, error);
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
