// Import any needed model functions
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
 } from "../models/categories.js";

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

// Export any controller functions to the view section
export {
    showCategoriesPage,
    showCategoryDetailsPage
};