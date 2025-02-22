import express from "express";
import tokenHandler from "../middlewares/auth.middleware.js";
import { getUser, getUserLogout } from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieves the authenticated user data
 *     description: |
 *       This endpoint retrieves the currently authenticated user's information. The token is validated and refreshed (if expired) by the middleware before the request reaches this endpoint.
 *       If the token is valid or successfully refreshed, user data is returned. If not, an error message is sent.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: Successfully retrieved user data. The token is valid or has been refreshed, and the user's information is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: The decoded user information from the JWT token.
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *       401:
 *         description: Unauthorized, the token is either missing or invalid and cannot be refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       403:
 *         description: Forbidden, the refresh token is missing or invalid, and the access token could not be refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 *       500:
 *         description: Internal Server Error, something went wrong during token verification or refresh.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication middleware error"
 */
router.get("/", tokenHandler, getUser);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logs out the current user
 *     description: |
 *       This endpoint logs the current user out by clearing the authentication cookies (`ACCESS_TOKEN` and `REFRESH_TOKEN`).
 *       After a successful logout, the user will no longer be authenticated, and their session will be invalidated.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: Successfully logged out. The user is now unauthenticated, and the session is cleared.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       401:
 *         description: Unauthorized, the user is not authenticated and cannot log out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No user data found"
 *       500:
 *         description: Internal Server Error, something went wrong during the logout process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Logout failed due to a server error"
 */
router.get("/logout", tokenHandler, getUserLogout);

export default router;
