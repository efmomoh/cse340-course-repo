// Import any needed model functions
import { body, validationResult } from "express-validator"
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from "../models/categories.js";
import { getProjectDetails }
    from "../models/projects.js";

// Define validation and sanitization rules for category data
const categoryValidation = [
    body("categoryName")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be between 3 and 100 characters")
];
    
// Define any controller functions for the categories page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { categories, title });
};

// Define the controller function for the category details page
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = "Category Details";

    res.render("category", { title, categoryDetails, projects });
};

// Create controller functions to handle displaying the assign categories form and processing the form submission.
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Display the new category form
const showNewCategoryForm = (req, res) => {
    const title = "Add New Category";

    res.render("new-category", { title });
};

// Process the new category form
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        return res.redirect("/new-category");
    }

    const { categoryName } = req.body;

    try {
        const newCategoryId = await createCategory(categoryName);

        req.flash("success", "New category created successfully.");

        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error("Error creating category:", error);

        req.flash("error", "There was an error creating the category.");

        res.redirect("/new-category");
    }
};


// Display the edit category form
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const categoryDetails = await getCategoryDetails(categoryId);

    const title = "Edit Category";

    res.render("edit-category", {
        title,
        categoryDetails
    });
};

// Process the edit category form
const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const { categoryName } = req.body;

    try {
        await updateCategory(categoryId, categoryName);

        req.flash("success", "Category updated successfully.");

        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error("Error updating category:", error);

        req.flash("error", "There was an error updating the category.");

        res.redirect(`/edit-category/${categoryId}`);
    }
};


// Export any controller functions to the view section
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};