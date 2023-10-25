const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
console.log("---------------------");
  
  const { username, email, password } = req.body;
console.log(username);
console.log(email);
console.log(password);
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // Username is already taken, return an error
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({ username, email, password: hashedPassword });
    const user = await newUser.save();

    // Send a success response with the user data
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    // Handle internal server error and return an error response
    res.status(500).json({ error: "Internal server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by looking up their email in the database
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Password does not match
      return res.status(401).json({ error: "Incorrect password" });
    }

    // If the email and password match, you can consider the user logged in
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
