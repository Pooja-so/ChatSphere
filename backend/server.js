//* CommonJS module
// const express = require("express");
// const dotenv = require("dotenv");

//* ES6 module */
import express from "express";
import dotenv from "dotenv";

// Compulsory to write .js extension otherwise it will not work
import authRoutes from "./routes/auth.routes.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

// Setting routes
app.get("/", (req, res) => {
  // root route http://localhost:5000/
  res.send("Hello World");
});

//* Calling middleware whenever the URL starts with /api/auth
// 1. calling authRoutes which is in auth.routes.js file when URL starts with /api/auth
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Srver is running on port ${PORT}`));
