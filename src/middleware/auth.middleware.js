import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const accessToken =
            req?.cookies?.accessToken ||
            req?.headers["authorization"]?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        } 

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized ! user not found" });
        }

        req.user = user;
        
        next();
    } catch (error) {
        console.log("[ERROR_VERIFYING_JWT]", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default verifyJWT;