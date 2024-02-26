import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // If token decoded successfully then find user
    const user = await User.findById(decoded.userId).select("-password");

    //If unable to fing user
    if (!user) {
      return res.status(404).json({ error: "User does not found" });
    }

    //If user found set it in req
    req.user = user;

    next(); // So that it can proceed to next operation
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
