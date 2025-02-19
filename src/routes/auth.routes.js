import express from "express";
import { getGithub } from "../controllers/authentication/gihub.controller.js";
import { getGitlab } from "../controllers/authentication/gitlab.controller.js";
import { getGoogle } from "../controllers/authentication/google.controller.js";
import { getEmail } from "../controllers/authentication/email.controller.js";

const router = express.Router();

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Sign in with GitHub
 *     description: Authenticate users using their GitHub account.
 *     tags:
 *       - Authentication
 */
router.get("/github", getGithub);

/**
 * @swagger
 * /auth/gitlab:
 *   get:
 *     summary: Sign in with GitLab
 *     description: Authenticate users using their GitLab account.
 *     tags:
 *       - Authentication
 */
router.get("/gitlab", getGitlab);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Sign in with Google
 *     description: Authenticate users using their Google account.
 *     tags:
 *       - Authentication
 */
router.get("/google", getGoogle);

/**
 * @swagger
 * /auth/email:
 *   get:
 *     summary: Sign in with Email
 *     description: Authenticate users using their email and password.
 *     tags:
 *       - Authentication
 */
router.get("/email", getEmail);

export default router;
