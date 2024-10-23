import User from '../models/user.model.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All feilds are required!" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exist!" });
        }

        const hanshedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hanshedPassword
        });

        await newUser.save();
        return res.json({ success: true, message: "New user created!", newUser });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}


export const userSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All feilds are required!" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isCorrect = bcrypt.compareSync(password, existingUser.password);

        if (isCorrect) {
            const {password: pass, ...rest} = existingUser._doc;
            const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
            return res.status(200).cookie("access_token", token).json({ message: "Sign In Success", user: rest});
        } else {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}


export const userSignOut = async (req, res) => {
    try {
        res.clearCookie("access_token"); // Clears the "access_token" cookie set in the signIn function
        return res.status(200).json({ message: "Sign Out Success" });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}
