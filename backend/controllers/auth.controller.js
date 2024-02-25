import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
  try {
    //Step1:  Fetching data from frontend "Form"
    const { fullName, username, password, confirmPassword, gender } = req.body;

    //Step 2.1: Checking whether the password & confirm password matches
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords didn't matched" });
    }

    //Step 2.2: Checking whether the username already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    //Step 3: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Step 4: Assigning Unique random profile picture according to the gender
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    //Step 5: Creating a new user instance using User model
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    // Step 6: Generating JWT token, Saving new user instance and (most imp): Sending response otherwise the browser will keep on loading
    if (newUser) {
      //Generating JWT token
      generateTokenAndSetCookie(newUser._id, res);
      // Saving user
      await newUser.save();

      //Sending response
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.send(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "internal Server Error" });
  }
};

const login = async (req, res) => {
  console.log("login user");
};

const logout = async (req, res) => {
  console.log("logout user");
};

export { signup, login, logout };
