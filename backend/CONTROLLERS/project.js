const fs = require('fs').promises;
const path = require('path');

const Project = require('../MODELS/Project');
const { startContainer } = require('../SERVICES/docker');
const { verifyToken } = require('../SERVICES/auth');

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function handleCreateProject(req, res) {
    try {
        const { project_name, project_description, image } = req.body;
        const token = req.cookies.token;

        if (!token) throw { statusCode: 401, message: 'Unauthorized' };
        if (!project_name || !image) throw { statusCode: 400, message: 'Missing required fields' };

        const user = verifyToken(token);
        if (!user) throw { statusCode: 401, message: 'Invalid token' };

        const project = await Project.create({
            project_name,
            project_description,
            owner_id: user.id,
            project_image: image
        });

        const projectsDir = path.join(__dirname, '../PROJECTS');
        const templateDir = path.join(__dirname, `../TEMPLATES/${image}`);
        const projectDir = path.join(projectsDir, project.project_id.toString());

        try {
            await fs.mkdir(projectsDir, { recursive: true });

            try {
                await fs.access(templateDir);
            } catch {
                throw { statusCode: 400, message: 'Template not found' };
            }

            await copyDir(templateDir, projectDir);
        } catch (dirError) {
            console.error('Directory creation error:', dirError);
            await Project.destroy({ where: { project_id: project.project_id } }); // Clean up the database record if directory creation fails
            throw {
                statusCode: 500,
                message: 'Failed to create project directory',
                originalError: dirError
            };
        }

        const { containerId, port } = await startContainer(image, project.project_id);

        res.status(201).json({
            status: 'success',
            data: {
                project_id: project.project_id,
                container_id: containerId,
                port
            }
        });

    } catch (error) {
        console.error('Project creation error:', error);

        // Enhanced error handling
        let status = 500;
        let message = 'Internal server error';

        if (error.statusCode) status = error.statusCode;
        if (error.message) message = error.message;

        // Specific handling for Docker errors
        if (error.reason === 'bad parameter') {
            status = 400;
            message = 'Container configuration error';
        }

        res.status(status).json({ status: 'fail', message });
    }
}

async function handleRunProject(req, res) {
    try {
        const { project_id } = req.body;
        const token = req.cookies.token;

        if (!token) throw { statusCode: 401, message: 'Unauthorized' };
        if (!project_id) throw { statusCode: 400, message: 'Missing field project_id' };

        const user = verifyToken(token);
        if (!user) throw { statusCode: 401, message: 'Invalid token' };

        const project = await Project.findOne({ where: { project_id, owner_id: user.id } });
        const { containerId, port } = await startContainer(project.project_image, project.project_id);

        res.status(201).json({
            status: 'success',
            data: {
                project_id: project.project_id,
                container_id: containerId,
                port
            }
        });
    } catch (error) {
        console.error("Error during running project:", error);
        res.status(500).json({ "status": "fail", "message": "Internal server error" });
    }
}

async function handleListUserProjects(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) throw { statusCode: 401, message: 'Unauthorized' };

        const user = verifyToken(token);
        if (!user) throw { statusCode: 401, message: 'Invalid token' };

        const projects = await Project.findAll({ where: { owner_id: user.id } });

        res.status(200).json({ status: 'success', data: projects });

    } catch (error) {
        console.error("Error listing user projects:", error);
        res.status(500).json({ "status": "fail", "message": "Internal server error" });
    }
}

module.exports = {
    handleRunProject,
    handleCreateProject,
    handleListUserProjects
};