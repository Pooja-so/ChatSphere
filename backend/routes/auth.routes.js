import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
const router = express.Router();

//* Before controller
// If we call /api/auth/login then the given respective callback function will be called
// router.get("/login", (req, res) => {
//   res.send("Login route");
// });

//* We gonna have controllers which will have the callback functions of (req,res)=>{} type for all respective routes
//* After controllers

// 2.1 Calling controller "signup" when the address bar has URL /api/auth/signup
router.post("/signup", signup);
// 2.2 Calling controller "login" when the address bar has URL /api/auth/login
router.post("/login", login);
// 2.3 Calling controller "logout" when the address bar has URL /api/auth/logout
router.post("/logout", logout);

export default router;
