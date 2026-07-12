import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

console.log("🚀 Server.js Loaded");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Starting Express...");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err);
  }
};

startServer();