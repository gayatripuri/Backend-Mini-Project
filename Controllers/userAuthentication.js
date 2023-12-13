const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Step 8: Fields for Signup
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, age, gender, mobile } = req.body;

    if (!(fullname && email && password && age && gender && mobile)) {
      return res.status(422).json({ error: "All fields are mandatory" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      age,
      gender,
      mobile,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 600,
      }
    );

    newUser.password = undefined; // Exclude the password from the response
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the required fields are provided
    if (!(email || password)) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Generate and return the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 600,
    });

    res
      .status(200)
      .json({ message: "Login successful", name: user.fullname, token });
  } catch (error) {
    console.error("Login failed:", error);

    res.status(500).json({ error: error.message || "Failed to login" });
  }
};
