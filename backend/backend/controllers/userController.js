import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // Validate input
        if (!name || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate name length
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({ message: "Name must be between 20 and 60 characters" });
        }

        // Validate address length
        if (address.length > 400) {
            return res.status(400).json({ message: "Address must not exceed 400 characters" });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters long, include at least one uppercase letter and one special character",
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            address,
            role: "user",
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Exclude password from the user object
        const { password: _, ...userWithoutPassword } = user._doc;

        res.status(200).json({ 
            message: "Login successful",
            token, 
            user: userWithoutPassword 
        });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }
};