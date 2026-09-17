// Import any needed model functions 
import { getAllProjects } from "../models/projects.js";

// Define any controller functions for the projects page
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = "Service Projects";
    res.render("projects", { title, projects });
};

// Export any controller functions that need to be used in route.js file
export { showProjectsPage };
