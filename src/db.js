import mongoose from "mongoose";

export const connectDB = async () => {
  try {     
    await mongoose.connect("mongodb://localhost/merv");
    console.log(">>>Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};