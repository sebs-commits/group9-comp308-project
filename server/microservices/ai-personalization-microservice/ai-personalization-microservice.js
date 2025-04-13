import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/federation";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { aiTypeDefs } from "./schemas/ai-typedefs.js";
import { aiResolvers } from "./resolvers/ai.server.resolver.js";

//import { GoogleGenerativeAI } from "@google/generative-ai";

const port = 4004;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3004"],
    credentials: true,
  })
);

// Setup Gemini

/*const geminiAI = new GoogleGenerativeAI("AIzaSyAVS4yoevOyTTjt2GmKvTRpHqqfnpZxxxE"); // Use a Google AI API key here

// Define the generation config
const genConfig = {
    stopSequences: [],
    maxOutputTokens: 1024,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};

// Create a generative model
const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-pro",  genConfig });*/

app.use(bodyParser.json());

const startServer = async () => {
    const server = new ApolloServer({
        schema: buildSubgraphSchema([
        { typeDefs: aiTypeDefs, resolvers: aiResolvers },
        ]),
        plugins: [ApolloServerPluginInlineTraceDisabled()],
    });

    await server.start();

    // Set up the GraphQL endpoint
    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res }),
        })
    );

    /*// Set up the Gemini endpoint
    app.post("/chat", async (req, res) => {
        // Get the prompt from the request
        const { prompt } = req.body;
        console.log('prompt=',prompt)

        // Generate content
        const result = await model.generateContent(prompt);
        // Get the response
        const response = await result.response;
        // Get the text from the response
        const text = response.text();
        console.log(text);

        // Send text response back to the client
        res.send(text);
    });*/

    app.listen(port, () => {
        console.log(
            `🚀 AI-Personalization Server ready at http://localhost:${port}/graphql`
        );
    });
};

startServer().catch((err) => {
    console.error("Failed to start server:", err);
});