import mongoose from "mongoose";

const DB_NAME = "registration"


console.log(`\nMONGO DB connection starting...`);

const connectDB = async () => {
     try {
          const connectionInstance = await mongoose.connect(`mongodb+srv://ayush:ayush123@cluster0.s0fsubx.mongodb.net/${DB_NAME}`)
          console.log(`\nMONGO DB connection made. DB_HOST: ${connectionInstance.connection.host} \n`);
     } catch (error) {
          console.error(error);
          

          throw error;

     }
}

export default connectDB;