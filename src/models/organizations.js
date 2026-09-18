import db from './db.js'

// Get all organizations
const getAllOrganizations = async () => {
    const query = `
        SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

/* Get organization details by ID
This function retrieves the details of a specific organization based on its ID. 
It returns the organization's information if found, or null if no organization matches the provided ID. */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows were found
    return result.rows.length > 0 ? result.rows[0] : null;
}

// Export the model functions for use in other parts of the application
export { getAllOrganizations, getOrganizationDetails };