import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

// Function to show user registration form
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Function to process user registration form
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to home page after successful registration
        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.'); // or

        // if (error.code === "23505" && error.constraint === "users_email_key") {
        //     req.flash('error', 'An account with this email address already exists. Please use a different email.');
        // } else {
        //     req.flash('error', 'Registration failed. Please try again.');
        // }
        res.redirect('/register');
    }
};

// Function to show login form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Function to process user login form
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;

            // Display a flash message for users/admins when they log in, showing their name and role
            req.flash('success', `Welcome ${user.name.toUpperCase()} to the ${user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1)} Dashboard!\
                You've logged in successfully as a/an ${user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1)}.`);

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard'); // Redirect to dashboard page after successful login

        } else {
            req.flash('error', 'Invalid email or password. Please try again.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

// Create a function called processLogout
const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user; // Remove user info from session
    }

    req.flash('success', 'You have been logged out successfully.');
    res.redirect('/login'); // Redirect to login page after logout
};

// Create Middleware to Protect Routes
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next(); // Continue to the next middleware or route handler
};

/*
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.')
            return res.redirect('/login');
        }

        // Check if the user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

// create a route and controller function to display the dashboard page
const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

// Export functions to be used in routes
export {
    showUserRegistrationForm, processUserRegistrationForm,
    showLoginForm, processLoginForm, processLogout,
    requireLogin, showDashboard, requireRole
};   