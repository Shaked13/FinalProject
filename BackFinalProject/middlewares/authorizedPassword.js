import dotenv from "dotenv";
dotenv.config();
const { PASSWORD } = process.env;

export const authorizedPassword = (req, res, next) => {
    const password = req.headers["x-auth-token"];

    if (!password) {
        console.log("No token provided");
        return res.status(403).json({ message: "Unauthorized: No token provided" });
    }

    if (password !== PASSWORD) {
        console.log("Incorrect password");
        return res.status(403).json({ message: "Unauthorized: Incorrect password" });
    }

    console.log("Password valid, proceeding...");
    next();
};