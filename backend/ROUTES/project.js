const express = require('express');
const { handleRunProject, handleCreateProject } = require('../CONTROLLERS/project');

const projectRouter = express.Router();

projectRouter.route('/start')
.post(handleRunProject);

projectRouter.route('/create')
.post(handleCreateProject);

module.exports = projectRouter;