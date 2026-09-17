// Import any needed model functions (none are needed for the home page, so this is empty)

// Define any controller functions for the home page
const showHomePage = async (req, res) => {
    const title = "Home";
    res.render("home", { title });
};

// Export any controller functions that need to be used in route.js file
export { showHomePage };
