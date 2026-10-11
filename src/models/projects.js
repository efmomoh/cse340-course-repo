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

// Create the model function to insert new service projects.
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project
        (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error("Failed to create project");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log("Created new project with ID:", result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// Create the model function
const updateProject = async (
    projectId,
    title, 
    description, 
    location,
    projectDate,
    organizationId) => {
    const query = `
        UPDATE service_project
        SET
            title = $1,
            description = $2, 
            location = $3, 
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING *;
    `;

    const queryParams = [title, description, location, projectDate, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error("Project update failed.");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log("Updated project successfully with ID:", result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

/* Add a volunteer signup for a project */
const addVolunteerToProject = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING /* Prevents duplicate signups for the same user and project */
        RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rowCount > 0;
};

/* Remove a volunteer signup for a project */
const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2
        RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rowCount > 0;
};

/* Check whether a user is volunteering for a project */
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 /* Returns 1 if the user is volunteering for the project, 0 otherwise */
        FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2
        LIMIT 1;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

/* Get all projects a user has volunteered for */
const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.description,
            service_project.location,
            service_project.project_date,
            service_project.organization_id,
            organization.name AS organization_name
        FROM project_volunteers
        JOIN service_project
            ON project_volunteers.project_id = service_project.project_id
        JOIN organization
            ON service_project.organization_id = organization.organization_id
        WHERE project_volunteers.user_id = $1
        ORDER BY service_project.project_date ASC;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
};


// Export the model functions for use in other parts of the application
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteerToProject,
    removeVolunteerFromProject,
    isUserVolunteering,
    getVolunteerProjects
};
