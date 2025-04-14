import NewsModel from "../models/news.server.model.js";

export const newsResolvers = {
  Query: {
    allNews: async () => {
      try {
        const news = await NewsModel.find();
        return news;
      } catch (error) {
        console.error("Error fetching all news:", error);
        throw new Error("Could not fetch news");
      }
    },

    news: async (_, { _id }) => {
      try {
        const newsItem = await NewsModel.findById(_id);
        return newsItem;
      } catch (error) {
        console.error("Error fetching news by ID:", error);
        throw new Error("Could not fetch news");
      }
    },

    userNews: async (_, { creatorId }) => {
      try {
        const userNews = await NewsModel.find({ creatorId });

        const formattedNews = userNews.map((newsItem) => ({
          ...newsItem.toObject(),
          creationDate: newsItem.creationDate
            ? newsItem.creationDate.toISOString()
            : null,
        }));

        return formattedNews;
      } catch (error) {
        console.error("Error fetching user news:", error);
        throw new Error("Could not fetch user news");
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
        });
        await newNews.save();
        return newNews;
      } catch (error) {
        console.error("Error creating news:", error);
        throw new Error("Could not create news");
      }
    },

    updateNews: async (_, { _id, creatorId, headline, textBody, image }) => {
      try {
        const updatedNews = await NewsModel.findByIdAndUpdate(
          _id,
          { creatorId, headline, textBody, image },
          { new: true }
        );
        return updatedNews;
      } catch (error) {
        console.error("Error updating news:", error);
        throw new Error("Could not update news");
      }
    },

    deleteNews: async (_, { _id }) => {
      try {
        const deletedNews = await NewsModel.findByIdAndDelete(_id);
        return deletedNews;
      } catch (error) {
        console.error("Error deleting news:", error);
        throw new Error("Could not delete news");
      }
    },
  },
};
