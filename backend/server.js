//* ES6 module */
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Compulsory to write .js extension otherwise it will not work
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json()); // to parse incomming request with JSON payload (from req.body)
app.use(cookieParser());

//* Calling middleware whenever the URL starts with /api/auth
// 1. calling authRoutes which is in auth.routes.js file when URL starts with /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Setting routes
// app.get("/", (req, res) => {
// root route http://localhost:5000/
//   res.send("Hello World");
// });

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
