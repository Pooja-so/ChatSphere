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
  try {
    // Step1: get input from the user Form
    const { username, password } = req.body;

    // Step 2.1: Check if the user with username exists or not
    const user = await User.findOne({ username });

    // Step 2.2: Check if the password is correct or not. In case if user doesn't exists, we'll pass a string in function of bcrypt so that it doesn;t throw any error
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    //Step3: Return error in response if either user doesn't exist or password is in-correct
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    //Step4: Generate JWT token if user logs in successfully
    generateTokenAndSetCookie(user._id, res);

    //Step5: (Imp) Send response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { signup, login, logout };
