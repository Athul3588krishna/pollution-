import userSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// REGISTER
export const addUser = async (req, res) => {
  try {
    const { name, email, pass, cpass } = req.body;

    if (!name || !email || !pass || !cpass) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    if (pass !== cpass) {
      return res.status(400).json({ msg: "Password mismatch" });
    }

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    await userSchema.create({
      name,
      email,
      pass: hashedPassword
    });

    res.status(201).json({ msg: "Registration successful" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    if (!email || !pass) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      msg: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getProfile = async (req, res) => {
   try {
    const user = await userSchema.findById(req.user.id).select("-pass")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}