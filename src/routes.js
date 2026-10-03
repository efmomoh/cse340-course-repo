import express from "express";

import {
    showUserRegistrationForm, processUserRegistrationForm,
    showLoginForm, processLoginForm, processLogout,
    requireLogin, showDashboard, requireRole
} from "./controllers/users.js";
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
    projectValidation, showEditProjectForm,
    processEditProjectForm
 } from "./controllers/projects.js";
import {
    showCategoriesPage, showCategoryDetailsPage,
    showAssignCategoriesForm, processAssignCategoriesForm,
    categoryValidation, showNewCategoryForm, processNewCategoryForm,
    showEditCategoryForm, processEditCategoryForm
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
router.get("/new-organization", requireRole('admin'), showNewOrganizationForm);
router.get("/edit-organization/:id", requireRole('admin'), showEditOrganizationForm);
router.get("/new-project", requireRole('admin'), showNewProjectForm);
router.get("/assign-categories/:projectId", requireRole('admin'), showAssignCategoriesForm);
router.get("/edit-project/:id", requireRole('admin'), showEditProjectForm);
router.get("/new-category", requireRole('admin'), showNewCategoryForm);
router.get("/edit-category/:id", requireRole('admin'), showEditCategoryForm);
router.get('/register', showUserRegistrationForm);
router.get('/login', showLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard); // Protect the dashboard route with requireLogin middleware

// Route to handle organization form submission
router.post("/new-organization", requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.post("/new-project", requireRole('admin'), projectValidation, processNewProjectForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
router.post("/edit-project/:id", requireRole('admin'), processEditProjectForm);
router.post("/new-category", requireRole('admin'), categoryValidation, processNewCategoryForm);
router.post("/edit-category/:id", requireRole('admin'), categoryValidation, processEditCategoryForm);
router.post('/register', processUserRegistrationForm);
router.post('/login', processLoginForm);

// Error handling route for testing 500 errors
router.get("/test-error", testErrorPage);

// Export the router to be used in the main server file
export default router;
