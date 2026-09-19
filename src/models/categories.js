import db from "./db.js";

// Get all categories
const getAllCategories = async () => {
    const query = `
        SELECT
        category_id,
        category_name
        FROM public.categories
        ORDER BY category_name;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Get One category or Retrieve a single category by its ID.
const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM categories
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};


// Get All categories attached to one project or Retrieve all categories for a given service project.
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            categories.category_id,
            categories.category_name
        FROM categories
        JOIN project_category
        ON categories.category_id = project_category.category_id
        WHERE project_category.project_id = $1
        ORDER BY categories.category_name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

// Get all service projects for a category or All projects attached to one category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.description,
            service_project.location,
            service_project.project_date,
            service_project.organization_id
        FROM service_project
        JOIN project_category
            ON service_project.project_id = project_category.project_id
        WHERE project_category.category_id = $1
        ORDER BY service_project.project_date;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};
