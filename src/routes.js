import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
    showOrganizationsPage, showOrganizationDetailsPage,
    showNewOrganizationForm, processNewOrganizationForm,
    organizationValidation, showEditOrganizationForm,
    processEditOrganizationForm
} from "./controllers/organizations.js";
import {
    showProjectsPage, showProjectDetailsPage,
    showNewProjectForm, processNewProjectForm,
    projectValidation
 } from "./controllers/projects.js";
import {
    showCategoriesPage, showCategoryDetailsPage,
    showAssignCategoriesForm, processAssignCategoriesForm
 } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

// Create a new router instance or object to define routes
const router = express.Router();

// Define the routes and associate them with controller functions
router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/category/:id", showCategoryDetailsPage);
router.get("/new-organization", showNewOrganizationForm);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.get("/new-project", showNewProjectForm);
router.get("/assign-categories/:projectId", showAssignCategoriesForm);

// Route to handle organization form submission
router.post("/new-organization", organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post("/new-project", projectValidation, processNewProjectForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Error handling route for testing 500 errors
router.get("/test-error", testErrorPage);

// Export the router to be used in the main server file
export default router;
