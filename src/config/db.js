import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const connectdb=async()=>{
    try {
        const connect= await mongoose.connect(process.env.Mongodb_url);
        console.log(`${connect.connection.host}`);
        
    } catch (error) {
        console.log("connection failed in connection db",error);

    }
    
}
export default connectdb;