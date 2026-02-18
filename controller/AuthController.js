import userSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// REGISTER
export const addUser = async (req, res) => {
  try {
    const { name, email, pass, cpass } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!name || !normalizedEmail || !pass || !cpass) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    if (pass !== cpass) {
      return res.status(400).json({ msg: "Password mismatch" });
    }

    const existingUser = await userSchema.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    await userSchema.create({
      name,
      email: normalizedEmail,
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
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !pass) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    const user = await userSchema.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret is not configured" });
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
