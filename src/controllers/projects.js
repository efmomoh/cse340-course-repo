// Import any needed model functions

import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js";

// Define the number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions for the projects page
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = "Upcoming Service Projects";

    res.render("projects", { title, projects });
};

// Define the controller function for the project details page
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const title = "Project Details";

    res.render("project", { title, project });

};

// Export any controller functions that need to be used in routes.js file
export {
    showProjectsPage,
    showProjectDetailsPage
};