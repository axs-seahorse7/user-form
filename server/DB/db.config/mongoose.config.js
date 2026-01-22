import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGOOSE_URL || "mongodb://127.0.0.1:27017/form_builder";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(" MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
