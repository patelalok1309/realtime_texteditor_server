import { Router } from "express";

import {
    generateAccessTokenUsingRefreshToken,
    isAuthenticated,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(generateAccessTokenUsingRefreshToken);

// Protected routes
router.use(verifyJWT);
router.route("/is-authinticated").get(isAuthenticated);

export default router;
