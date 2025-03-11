import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import sessions from "express-session";
import WebAppAuthProvider from "msal-node-wrapper";
import { fileURLToPath } from "url";
import { dirname } from "path";
import models from "./models.js";
import router from "./routes/api.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.enable("trust proxy");

// **Session middleware should be before the auth middleware**
app.use(sessions({
    secret: "your-secret-key",  // Use a more secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set to true if using HTTPS in production
}));

// **Azure authentication setup**
const authConfig = {
    auth: {
        clientId: "31360a76-b638-4996-b530-b6716a8ca5cc", // Your Azure Application (client) ID
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2", // Your Azure Directory (tenant) ID
        clientSecret: process.env.AZURE_CLIENT_SECRET, // Your Azure Application Secret
        redirectUri: "http://localhost:3000/redirect", // Redirect URI after login (use your deployed domain)
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
};

// Initialize authentication provider after session is set up
const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());  // Authentication middleware

// Middleware to parse incoming requests
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    req.models = models; // Attach models to req
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", router);

// Sign-in route
app.get("/signin", (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // Redirect to home or dashboard after login
    })(req, res, next);
});

// Sign-out route
app.get("/signout", (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // Redirect to home or another page after logout
    })(req, res, next);
});

// Redirect URI after authentication
app.get("/redirect", async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).json({
            error: "Authorization code not found in query parameters",
        });
    }

    const authCodeRequest = {
        code: authCode,
        redirectUri: "http://localhost:3000/redirect", // Your redirect URI
    };

    try {
        const result = await authProvider.authContext.acquireTokenByCode(authCodeRequest);

        // Store user information in session after successful login
        req.session.accessToken = result.accessToken;
        req.session.account = {
            name: result.account.name,
            username: result.account.username,
        };

        res.redirect("/dashboard"); // Redirect to the dashboard or main page
    } catch (error) {
        console.error("Error exchanging auth code for token:", error);
        res.status(500).json({
            error: "Error exchanging authorization code for access token",
            message: error.message,
        });
    }
});

// Handle interaction errors for the auth provider
app.use(authProvider.interactionErrorHandler());

// Make sure this route is accessible to authenticated users only
app.use((req, res, next) => {
    if (!req.session.accessToken) {
        return res.redirect("/signin");
    }
    next();
});

// Example protected route (dashboard or main page)
app.get("/dashboard", (req, res) => {
    res.send(`Welcome ${req.session.account.name}! You are logged in as ${req.session.account.username}.`);
});

// Listen on port 3000
app.listen(3000, "localhost", () => {
    console.log("App listening at http://localhost:3000");
});

export default app;