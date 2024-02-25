import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // Creating JWT token using userId as payload and signing it with JWT_SECRET_KEY that expires in 15 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });

  // Setting the cookie with name jwt and having token as value that expires in 15 days(specified in milliseconds)
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // so that user cannot access cookie via JavaScript, Preventing XSS attacks cross-site-scripting attacks
    sameSite: "strict", // Prevent CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development", // In development mode, it is false. while in production mode it will be true
  });
};

export default generateTokenAndSetCookie;
