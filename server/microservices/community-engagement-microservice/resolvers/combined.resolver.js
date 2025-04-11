import { alertResolvers } from "./alert.server.resolver.js";
import { newsResolvers } from "./news.server.resolver.js";
import { requestsResolvers } from "./requests.server.resolver.js";
import { discussionsResolvers } from "./discussions.resolver.js";

export const combinedResolvers = {
    Query: {
        _microservice: () => "This is a micro service query",
        ...newsResolvers.Query,
        ...requestsResolvers.Query,
        ...alertResolvers.Query,
        ...discussionsResolvers.Query

    },

    Mutation: {
        ...newsResolvers.Mutation,
        ...requestsResolvers.Mutation,
        ...alertResolvers.Mutation,
        ...discussionsResolvers.Mutation
    }
}