import jwt from "jsonwebtoken";
const SECRET = "secretkey";
const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!token) {
        res.status(401).json({ message: " No token provided" });
        return;
    }
    try {
        const decode = jwt.verify(token, SECRET);
        req.user = decode;
        console.log("USER:", req.user);
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
export default authmiddleware;
//# sourceMappingURL=authmiddleware.js.map