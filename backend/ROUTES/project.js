const express = require('express');
const { handleRunProject, handleCreateProject, handleListUserProjects } = require('../CONTROLLERS/project');

const projectRouter = express.Router();

projectRouter.route('/')
.get(handleListUserProjects);

projectRouter.route('/start')
.post(handleRunProject);

projectRouter.route('/create')
.post(handleCreateProject);

module.exports = projectRouter;