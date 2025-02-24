import express from "express";
import {
	getGithub,
	getGitHubCallback,
} from "../controllers/gihub.controller.js";
import { getUser, removeUser } from "../controllers/user.controller.js";

const router = express.Router();

//TODO: add swagger comments
router.get("/me", getUser);

//TODO: add swagger comments
router.get("/logout", removeUser);

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

//TODO: update swagger comments
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
