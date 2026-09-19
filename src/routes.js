import express from "express";

import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage, showOrganizationDetailsPage } from "./controllers/organizations.js";
import { showProjectsPage, showProjectDetailsPage } from "./controllers/projects.js";
import { showCategoriesPage } from "./controllers/categories.js";
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

// Error handling route for testing 500 errors
router.get("/test-error", testErrorPage);

// Export the router to be used in the main server file
export default router;
