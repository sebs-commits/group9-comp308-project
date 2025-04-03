import { getToday } from "../../../shared/utils.js";
import NewsModel from "../models/news.server.model.js";

export const newsResolvers = {
    Query: {
        allNoneExpiredNews: async () => {
            try {
                const today = getToday();                
                const news = await NewsModel.find({expiryDate: { $gte: today }});
                return news || [];
            } catch(error) {
                console.error(`An error occurred while fetching news`, error);
                throw new Error("Error in news query - news.server.resolver.js");
            }
        },

        news: async (_, { _id }) => await NewsModel.findOne({ _id })
    },

    Mutation: {
        createNews: async (_, { creatorId, headline, summary, fullnews, creationDate, expiryDate }) => {
            try {
                const newNews = new NewsModel({ creatorId, headline, summary, fullnews, creationDate, expiryDate });
                return await newNews.save();
            } catch(error) {
                console.error(`An error occurred while creating a news: `, error);
                throw new Error("Error in createNews - news.server.resolver.js");
            }            
        },

        updateNews: async (_, { _id, creatorId, headline, summary, fullnews, creationDate, expiryDate }) => { 
            try {
                const existingNews = await NewsModel.findOne({ _id });
                if(!existingNews)
                    throw new Error("You are trying to update a non-existent news.")

                return await NewsModel.findByIdAndUpdate(_id, { creatorId, headline, summary, fullnews, creationDate, expiryDate });
            } catch(error) {
                console.error(`An error occurred while updating a news: `, error);
                throw new Error("Error in updateNews - news.server.resolver.js");
            }            
        },
        
        deleteNews: async (_, { _id }) => {  
            try {
                return await NewsModel.findByIdAndDelete(_id);
            } catch(error) {
                console.error(`An error occurred while deleting a news: `, error);
                throw new Error("Error in deleteNews - news.server.resolver.js");
            }
        }
    }
}