// Import any needed model functions (none are needed for the home page, so this is empty)

// Define any controller functions for the home page
const showHomePage = async (req, res) => {
    const user = req.session.user; // Get the user from the session

    const title = "Home";
    res.render("home", {
        title, // Set the title for the page
        isLoggedIn: !!user, // Check if the user is logged in (user exists in session)
        name: user ? user.name : null // Get the user's name if logged in, otherwise null
    });
};

// Export any controller functions that need to be used in route.js file
export { showHomePage };
