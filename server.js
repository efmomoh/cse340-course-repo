import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import session from "express-session";
import flash from "./src/middleware/flash.js";
import router from "./src/routes.js";

console.log("Hello, Node.js!");

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

//Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// oad the session secret from your environment variables
const SESSION_SECRET = process.env.SESSION_SECRET;

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse POST request data or Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Configure Express middleware */
// Serve static files from the public directory (automatically)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));

/* MIDDLEWARE FUNCTIONS ALWAYS COME BEFORE ROUTE HANDLERS */

// Set up session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

// Use flash message middleware
app.use(flash);

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware function or route handler
});

// Middleware to make NODE_ENV available in all templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = false; // Initialize isLoggedIn to false for all requests
    if (req.session && req.session.user) { // Check if the user is logged in by checking the session
        res.locals.isLoggedIn = true; // Set isLoggedIn to true if the user is logged in
    }
    
    // Make the user object available in templates
    // This allows you to access user information in your EJS templates, such as the user's name or role.
    res.locals.user = req.session.user || null;

    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/* Use the imported router for all routes */
app.use("/", router);

// MIDDLEWARE FOR HANDLING 404 ERRORS
// Catch-all routes for 404 errors (Page Not Found)
app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});

