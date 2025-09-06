const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();

const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

const IMAGE_MAPPING = {
    node: 'node:20-alpine',
    python: 'python:3.11-alpine',
    java: 'eclipse-temurin:17-jre-alpine',
    go: 'golang:alpine',
    ruby: 'ruby:alpine'
};

const getAvailablePort = async () => {
    try {
        // Gets list of all the pre-occupied ports
        const usedPorts = (await docker.listContainers())
            .flatMap(container => Object.values(container.Ports || []))
            .map(port => port.PublicPort)
            .filter(Boolean);

        // Checks for available ports in the range 4000-6000
        for (let port = 4000; port <= 6000; port++) {
            if (!usedPorts.includes(port))
                return port;
        }
        throw new Error('No available ports found');
    } catch (error) {
        console.error('Port check failed, using random port', error);
        return Math.floor(Math.random() * 2000) + 4000;
    }
};

const startContainer = async (imageType, projectId) => {
    const image = IMAGE_MAPPING[imageType];
    if (!image) throw new Error(`Unsupported image type: ${imageType}`);

    const containerName = `project-${projectId}`;

    try { // Check if container already exists and is running
        const containers = await docker.listContainers({ all: true });
        const existingContainer = containers.find(
            container => container.Names.some(name => name.includes(containerName))
        );

        if (existingContainer) {
            if (existingContainer.State === 'running') {
                // Get the host port mapping
                const port = existingContainer.Ports[0]?.PublicPort ||
                    await getAvailablePort();
                return {
                    containerId: existingContainer.Id,
                    port
                };
            } else {
                // Remove the stopped container
                const container = docker.getContainer(existingContainer.Id);
                await container.remove();
            }
        }
    } catch (error) {
        console.error('Error checking existing containers:', error);
    }

    try {
        await docker.getImage(image).inspect();
    } catch {
        // console.log(`Pulling image ${image}...`);
        await new Promise((resolve, reject) => {
            docker.pull(image, (err, stream) => {
                if (err) return reject(err);
                docker.modem.followProgress(stream, (err) => {
                    err ? reject(err) : resolve();
                });
            });
        });
    }

    const port = await getAvailablePort();
    const templatePath = path.resolve(__dirname, `../PROJECTS/${projectId}`);

    const container = await docker.createContainer({
        Image: image,
        name: containerName,
        HostConfig: {
            PortBindings: {
                '3000/tcp': [{ HostPort: `${port}` }] // Maps the container’s port 3000 to the chosen host port.
            },
            AutoRemove: true, // Auto-remove when container stops
            Binds: [`${templatePath}:/my_app`]
        },
        Env: [
            `PROJECT_ID=${projectId}`,
            'NODE_ENV=DEV',
            'PORT=3000'
        ],
        Cmd: ['tail', '-f', '/dev/null'],
        Tty: true,
        WorkingDir: '/my_app'
    });

    await container.start();
    return { containerId: container.id, port };
};

async function getContainerFileTree(containerId, cwd = "/my_app") {
    try {
        // This will list everything (dirs + files) under cwd
        const { stdout } = await execPromise(
            `docker exec ${containerId} find ${cwd} -print`
        );

        const paths = stdout.trim().split("\n");
        const tree = buildTree(paths, cwd);
        return tree;
    } catch (err) {
        console.error("Error fetching container file tree:", err);
        throw err;
    }
}

/**
 * Convert flat list of paths into nested JSON tree
 */
function buildTree(paths, base) {
    const root = { name: base, type: "folder", children: [] };

    for (const fullPath of paths) {
        const relative = fullPath.replace(base + "/", "");
        if (!relative || relative === base) continue;

        const parts = relative.split("/");
        let current = root;

        parts.forEach((part, idx) => {
            let existing = current.children.find(c => c.name === part);
            if (!existing) {
                existing = {
                    name: part,
                    type: idx === parts.length - 1 && !fullPath.endsWith("/") ? "file" : "folder",
                    children: []
                };
                current.children.push(existing);
            }
            current = existing;
        });
    }

    return root;
}

module.exports = { startContainer, getContainerFileTree };