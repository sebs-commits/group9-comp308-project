import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async () => {
    try {
        const db = await mongoose.connect(config.db);
        console.log(`DB Connected!!`);

        return db;        
    } catch(error) {
        console.error(`An error occurred while connecting to the DB`);
        throw error;
    }
}

export default connectToDB;