const Project = require('../MODELS/Project');
const { startContainer } = require('../SERVICES/docker');
const { verifyToken } = require('../SERVICES/auth');

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

module.exports = {
    handleRunProject,
    handleCreateProject
};