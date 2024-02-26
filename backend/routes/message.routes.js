import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

//*Note: when the route has /send/123 protectRoute will be called which will verify the user on the basis of jwt token stored in the req.cookies. If the token is decoded successfully it will set the req.user=user and then calls next() which will in turn call the next parameter viz sendMessage here
router.post("/send/:id", protectRoute, sendMessage);

router.get("/:id", protectRoute, getMessages);


export default router;
