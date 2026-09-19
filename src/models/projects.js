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

// Get the next upcoming service projects
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.description,
            service_project.project_date,
            service_project.location,
            service_project.organization_id,
            organization.name
        FROM service_project
        JOIN organization
            ON service_project.organization_id = organization.organization_id
        WHERE service_project.project_date >= CURRENT_DATE
        ORDER BY service_project.project_date ASC
        LIMIT $1
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows; // returns array of projects
};

// Get a single project by ID
const getProjectDetails = async (id) => {
    const query = `
        SELECT
        service_project.project_id,
        service_project.title,
        service_project.description,
        service_project.project_date,
        service_project.location,
        service_project.organization_id,
        organization.name
    FROM public.organization
    JOIN public.service_project
      ON organization.organization_id = service_project.organization_id
    WHERE service_project.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0]; // returns one project from the array
};

// Export the model functions for use in other parts of the application
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails
};
