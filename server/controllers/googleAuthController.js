// controllers/googleAuthController.js

const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;
    
    // 💡 Step 1: Find user by a unique Google identifier (email is a good choice)
    let user = await User.findOne({ email: email }); // Assuming you added an 'email' field to the User model (see below)

    if (!user) {
      // If the user doesn't exist, create a new one.
      
      // 💡 Step 2: Use 'name' for the display username. 
      //    Note: If 'name' is already taken, you'll need logic to handle it (e.g., name + last 4 digits of sub)
      let displayUsername = name; 
      
      // Basic check if the chosen username is already taken by a traditional user
      const existingUser = await User.findOne({ username: displayUsername });
      if (existingUser) {
          // Fallback: Use name + a unique suffix
          displayUsername = `${name}_${sub.slice(-4)}`; 
      }
      
      user = await User.create({ 
        username: displayUsername, 
        email: email, // Save the email for unique identification
        password: sub, // dummy password
      });
    }

    // Generate JWT and send the display username back
    const myToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: myToken, username: user.username });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ message: "Invalid Google token or account error" });
  }
};