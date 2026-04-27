import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
const SECRET = "secretkey";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=loginController.js.map