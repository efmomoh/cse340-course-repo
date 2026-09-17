// Import any needed model functions
import { getAllCategories } from "../models/categories.js";

// Define any controller functions for the categories page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Category';

    res.render('categories', { categories, title });
};

// Export any controller functions
export { showCategoriesPage };