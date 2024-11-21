import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            throw new ApiError(
                400,
                "Username, email, and password are required"
            );
        }

        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User already registered" });
        }

        const newUser = await User.create({
            username,
            email,
            password,
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            newUser,
        });
    } catch (error) {
        console.log("[ERROR_REGISTERING_USER]", error);
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                success: false,
                message: "email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        if (!(await user.isPasswordCorrect(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res
            .status(200)
            .json({ message: "User logged out successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
    }
};

const generateAccessTokenUsingRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Read from secure cookie
    if (!refreshToken) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const id = decoded._id;

        if (!id) {
            return res
                .status(400)
                .json({ message: "Refresh token is invalid , id not found" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res
                .status(400)
                .json({ message: "Refresh token is invalid , user not found" });
        }

        const accessToken = user.generateAccessToken();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while verifying refresh token",
        });
    }
};

const isAuthenticated = (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
};


export {
    registerUser,
    loginUser,
    logoutUser,
    generateAccessTokenUsingRefreshToken,
    isAuthenticated,
};
