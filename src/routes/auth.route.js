import { Router } from 'express';

import {
	generateAccessTokenUsingRefreshToken,
	loginUser,
	logoutUser,
	registerUser,
} from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/refresh-token').post(generateAccessTokenUsingRefreshToken);

export default router;
