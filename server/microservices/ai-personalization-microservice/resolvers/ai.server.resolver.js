import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAI = new GoogleGenerativeAI("AIzaSyDvBuMURQuFVDjImXMI33-P64qr2prTaUw"); // Use a Google AI API key here (using 0909htht@gmail.com rn)

// Define the generation config
const genConfig = {
    stopSequences: [],
    maxOutputTokens: 1024,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};

// Create a generative model
const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-pro",  genConfig });

export const aiResolvers = {
    Query: {
        _microservice: () => "This is a micro service query",

        requestAssistance: async (_, { prompt }) => {
            try {

                // Get the prompt from the request
                console.log('prompt >>> ', prompt); // will be customized to the request location

                // Generate content
                const result = await model.generateContent(prompt);

                // Get the response
                const response = await result.response;

                // Get the text from the response
                const text = response.text();
                console.log("Response >>> ", text);

                // Send text response back to the client
                return text;
            } catch (error) {
                console.error(`An error occurred while processing the request: `, error);
                throw new Error("Error in request - ai.server.resolver.js");
            }
        }
    },
}