const express = require('express');
const { handleRunProject, handleCreateProject, handleListUserProjects, handleGetProjectFileTree, handleGetSpecificFile, handleUpdateSpecificFile } = require('../CONTROLLERS/project');

const projectRouter = express.Router();

projectRouter.route('/')
.get(handleListUserProjects);

projectRouter.route('/start')
.post(handleRunProject);

projectRouter.route('/create')
.post(handleCreateProject);

projectRouter.route('/fileTree')
.post(handleGetProjectFileTree);

projectRouter.route('/getFile')
.post(handleGetSpecificFile);

projectRouter.route('/updateFile')
.post(handleUpdateSpecificFile);

module.exports = projectRouter;