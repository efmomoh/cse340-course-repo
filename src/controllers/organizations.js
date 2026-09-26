// Import any needed model functions
import { body, validationResult } from 'express-validator';
import {
    getAllOrganizations, getOrganizationDetails,
    createOrganization, updateOrganization
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Define any controller functions for the organizations page
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = "Our Partner Organizations";
    res.render("organizations", { title, organizations });
};

// Define any controller functions for the organization details page
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render("organization", { title, organizationDetails, projects });
};

// Creates a new organization form
const showNewOrganizationForm = async (req, res) => {
    const title = "Add New Organization";

    res.render("new-organization", { title });
};

// Process a new organization form
const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // IF ERRORS FOUND: Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization added successfully!');

    //IF NO ERRORS: Redirect to organization details page based on ID
    res.redirect(`/organization/${organizationId}`);
};

// crreate show edit organization function
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    const title = "Edit Organization";
    res.render('edit-organization', { title, organizationDetails });
};

// process the organization form from the dbase
const processEditOrganizationForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect('/edit-organization/' + req.params.id);
    }
    
    const organizationId = req.params.id;
    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions that need to be used in route.js file
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm

};
