/* Create organizations Table */
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

/* Insert Data into organization table */
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES (
	'BrightFuture Builders',
	'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
	'info@brightfuturebuilders.org',
	'brightfuture-logo.png'	
	),
	(
		'GreenHarvest Growers',
		'An urban farming collective promoting food sustainability and education in local neighborhoods.',
		'contact@greenharvest.org',
		'greenharvest-logo.png'
	),
	(
		'UnityServe Volunteers',
		'A volunteer coordination group supporting local charities and service initiatives.',
		'hello@unityserve.org',
		'unityserve-logo.png'
	);

-- Query all tables
SELECT * FROM organization;

/* Create Service Project table */
CREATE TABLE service_project (
	project_id SERIAL PRIMARY KEY,
	organization_id INTEGER NOT NULL,
	title VARCHAR (150) NOT NULL,
	description TEXT NOT NULL,
	location VARCHAR(255) NOT NULL,
	project_date DATE NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
);

-- Insert data into the project table
INSERT INTO service_project (organization_id, title, description, location, project_date)
	VALUES
	(
	    1,
	    'Community Center Renovation',
	    'Volunteers will help renovate and improve a local community center.',
	    'Monrovia Community Center',
	    '2026-10-05'
	),
	(
	    1,
	    'School Building Repair',
	    'Volunteers will assist with repairing classrooms and improving the school environment.',
	    'Central High School',
	    '2026-10-12'
	),
	(
	    1,
	    'Public Park Improvement',
	    'Volunteers will clean and improve facilities in a public park.',
	    'Paynesville Park',
	    '2026-10-19'
	),
	(
	    1,
	    'Community Library Construction',
	    'Volunteers will assist with construction work for a community library.',
	    'New Kru Town',
	    '2026-10-26'
	),
	(
	    1,
	    'Neighborhood Drainage Project',
	    'Volunteers will help improve drainage infrastructure in the neighborhood.',
	    'Sinkor Community',
	    '2026-11-02'
	),
	(
	    2,
	    'Community Garden Project',
	    'Volunteers will establish a vegetable garden for the local community.',
	    'Paynesville Community Garden',
	    '2026-10-07'
	),
	(
	    2,
	    'Urban Farming Workshop',
	    'Volunteers will teach residents basic urban farming techniques.',
	    'Monrovia Youth Center',
	    '2026-10-14'
	),
	(
	    2,
	    'Tree Planting Campaign',
	    'Volunteers will plant trees to improve the local environment.',
	    'Paynesville',
	    '2026-10-21'
	),
	(
	    2,
	    'Food Sustainability Program',
	    'Volunteers will educate families about sustainable food production.',
	    'Sinkor Community',
	    '2026-10-28'
	),
	(
	    2,
	    'School Vegetable Garden',
	    'Volunteers will establish a vegetable garden at a local school.',
	    'Monrovia Public School',
	    '2026-11-04'
	),
	(
	    3,
	    'Community Cleanup',
	    'Volunteers will clean streets and public spaces in the community.',
	    'Central Monrovia',
	    '2026-10-09'
	),
	(
	    3,
	    'Food Donation Drive',
	    'Volunteers will collect and distribute food to families in need.',
	    'Paynesville',
	    '2026-10-16'
	),
	(
	    3,
	    'Youth Volunteer Program',
	    'Volunteers will organize activities that encourage young people to serve their communities.',
	    'Monrovia Youth Center',
	    '2026-10-23'
	),
	(
	    3,
	    'Senior Support Program',
	    'Volunteers will assist elderly community members with basic household needs.',
	    'Sinkor',
	    '2026-10-30'
	),
	(
	    3,
	    'Neighborhood Beautification',
	    'Volunteers will improve public spaces through cleaning and landscaping activities.',
	    'New Kru Town',
	    '2026-11-06'
	);

-- Verify the data 
SELECT * FROM service_project;

-- Join the two tables and display
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

/* Create service category table */
CREATE TABLE categories (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(150) NOT NULL
);

-- Insert data into the category table
INSERT INTO categories (category_name)
VALUES
    ('Environmental'),
    ('Education'),
    ('Food and Nutrition'),
    ('Community Development'),
    ('Youth Support'),
    ('Construction'),
    ('Health and Wellness');

-- Verify the categories
SELECT * FROM categories;

/* Create a linking/bridge table between service project and category
   that establishes a many-to-many relationship */

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project (project_id),
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

/* Associate service projects with categories */

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 4),
    (1, 6),
    (2, 2),
    (2, 6),
    (3, 1),
    (4, 2),
    (4, 6),
    (5, 1),
    (6, 1),
    (6, 3),
    (7, 2),
    (8, 1),
    (9, 3),
    (10, 2),
    (11, 1),
    (12, 3),
    (13, 5),
    (14, 7),
    (15, 4);

/* Verify the Project_Category table */

SELECT * FROM project_category;
