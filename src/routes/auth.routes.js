import express from "express";
import {
	getGithub,
	getGitHubCallback,
} from "../controllers/authentication/provider/gihub.controller.js";
import {
	getAuthStatus,
	getUser,
} from "../controllers/authentication/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Checks and returns the authentication status
 *     description: |
 *       This endpoint checks the authentication status of the current user. If the authentication status is found in the cookies, it returns the status.
 *       If no status is found, a `204 No Content` response is returned. The status is then cleared after it is retrieved.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the authentication status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 provider:
 *                   type: string
 *                   example: "GitHub"
 *                 type:
 *                   type: string
 *                   example: "auth_success"
 *                 message:
 *                   type: string
 *                   example: "Successfully connected to GitHub"
 *       204:
 *         description: No authentication status found, no content to return.
 *       500:
 *         description: Internal Server Error, something went wrong while retrieving the authentication status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 provider:
 *                   type: string
 *                   example: "GitHub"
 *                 type:
 *                   type: string
 *                   example: "unknown_error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.get("/status", getAuthStatus);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Retrieves the authenticated user data
 *     description: |
 *       This endpoint retrieves the currently authenticated user's information by verifying the JWT token from the request cookie.
 *       If the token is valid, user data is returned. If not, an error message is sent.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved user data. The token is valid, and the user's information is returned.
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
 *         description: Unauthorized, the token is either missing or invalid.
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
 *                   example: "No token found"
 *       500:
 *         description: Internal Server Error, something went wrong during token verification.
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
 */
router.get("/user", getUser);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initiates GitHub OAuth Authentication
 *     description: |
 *       This endpoint redirects the user to GitHub's OAuth authorization page, where the user can log in and grant the required permissions.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to GitHub OAuth authorization page.
 *         headers:
 *           Location:
 *             description: The URL to which the user is redirected for GitHub OAuth login.
 *             schema:
 *               type: string
 *               example: "https://github.com/login/oauth/authorize?client_id=your_client_id&scope=user:email"
 *       400:
 *         description: Bad Request, typically if the GitHub client ID is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "GitHub client ID is missing or invalid"
 */
router.get("/github", getGithub);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth Callback
 *     description: |
 *       This endpoint handles the OAuth callback from GitHub after a user has authenticated. It retrieves the access token and user information from GitHub and establishes the user session.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The authorization code received from GitHub after user authentication.
 *       - in: query
 *         name: error
 *         required: false
 *         description: The error code, if an error occurred during the GitHub OAuth process.
 *       - in: query
 *         name: error_description
 *         required: false
 *         description: A detailed description of the error that occurred.
 *     responses:
 *       200:
 *         description: Successfully authenticated with GitHub. A session is created, and the user is redirected to the login page.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Successfully connected to GitHub"
 *       400:
 *         description: Bad Request, typically caused by an error in the authentication process or invalid user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve access token"
 *       500:
 *         description: Internal Server Error, an unexpected error occurred during the authentication process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 *     security:
 *       - OAuth2: [read, write]
 */
router.get("/github/callback", getGitHubCallback);

export default router;
