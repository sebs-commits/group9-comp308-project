import cookieParser from "cookie-parser";
import { combinedTypeDefs } from "./schemas/combined-typedefs.js";
import { combinedResolvers } from "./resolvers/combined.resolver.js";

const port = 3005;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();

