// Import any needed model functions

// Define any controller functions for the error page

// Test route for 500 errors
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

// Export any controller functions that need to be used in route.js file
export { testErrorPage };