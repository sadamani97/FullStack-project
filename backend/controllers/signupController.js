import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

const SECRET = "secretkey";


export const signup = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hash
        })
        res.json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }


};
