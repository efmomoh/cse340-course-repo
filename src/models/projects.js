import db from "./db.js";

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

export { getAllProjects };