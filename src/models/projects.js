import db from "./db.js";

// Get all projects with organization names
const getAllProjects = async () => {
    const query = `
    SELECT
        service_project.project_id,
        service_project.title,
        service_project.description,
        service_project.location,
        service_project.project_date,
        organization.name
    FROM public.organization
    JOIN public.service_project
      ON organization.organization_id = service_project.organization_id;
  `;

    const result = await db.query(query);
    return result.rows;
};

/* Get projects by organization ID  
This function retrieves all projects associated with a specific organization based on its ID. 
It returns an array of projects if found, or an empty array if no projects are associated 
with the provided organization ID. */

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions for use in other parts of the application
export { getAllProjects, getProjectsByOrganizationId };