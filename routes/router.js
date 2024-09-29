import express from "express";
import { jobs, users, assignedJobs, buildings } from '../data/data.js';
import fs from "fs"
import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Hilfsfunktion, um die Basic Auth zu extrahieren
function extractCredentials(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;

    // Der Authorization Header sollte mit "Basic " beginnen
    const base64Credentials = authHeader.split(' ')[1]; // "Basic dXNlcm5hbWU6cGFzc3dvcmQ="
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':'); // Zerlege "username:password"

    return { username, password };
}

// Login Route (Basic Auth ist implizit durch den Header)
router.post('/login', async (req, res) => {
    const credentials = extractCredentials(req);
    if (!credentials) {
        return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const { username, password } = credentials;

    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        return res.status(200).json({
            success: true,
            id: user.id,
            roles: user.roles
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Falscher Benutzername oder Passwort'
        });
    }
});

// Jobs Route
router.post('/jobs', async (req, res) => {
    const credentials = extractCredentials(req);
    if (!credentials) {
        return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const { username, password } = credentials;

    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        const assignedUserJobs = assignedJobs.filter(job => job.userID === user.id);
        if (assignedUserJobs.length > 0) {
            const jobDetails = assignedUserJobs.map(assignedJob =>
                jobs.find(job => job.id === assignedJob.jobId)
            ).filter(job => job); // Filtert null-Werte
            if (jobDetails.length > 0) {
                return res.json({ success: true, jobs: jobDetails });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Keine Details für zugewiesene Jobs gefunden'
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: 'Keine Jobs für diesen Benutzer zugewiesen'
            });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Falscher Benutzername oder Passwort' });
    }
});

// Thumbnail Route
router.post('/thumbnail', (req, res) => {
    const credentials = extractCredentials(req);
    if (!credentials) {
        return res.status(401).send('Authorization header missing');
    }

    const { username, password } = credentials;
    const { buildingId } = req.body; // BuildingId aus dem Body

    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        const buildingImage = getImageByBuildingId(buildingId);
        const buildingPath = path.join(__dirname, '..', 'data', 'images', buildingId);
        const filePath = path.join(buildingPath, buildingImage);

        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Route Image Route
router.post('/routeImage', (req, res) => {
    const credentials = extractCredentials(req);
    if (!credentials) {
        return res.status(401).send('Authorization header missing');
    }

    const { username, password } = credentials;
    const { jobId, routeId } = req.body; // jobId und routeId aus dem Body

    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        const job = jobs.find(job => job.id === jobId);
        if (!job) {
            return res.status(404).send('Job not found');
        }

        const buildingId = job.buildingId;
        const buildingPath = path.join(__dirname, '..', 'data', 'images', buildingId);
        const route = job.route.find(route => route.id === routeId);

        if (!route) {
            return res.status(404).send('Route not found');
        }

        const filePath = path.join(buildingPath, route.routeImage);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Finish Job Route
router.post('/finishJob', (req, res) => {
    const credentials = extractCredentials(req);
    if (!credentials) {
        return res.status(401).send('Authorization header missing');
    }

    const { username, password } = credentials;
    const { job } = req.body;

    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        // Hier wäre der Logik-Teil für das Abschließen des Jobs
        return res.status(200).json({ 'success': true });
    } else {
        return res.status(401).send('Unauthorized');
    }
});

// Map Route
router.post('/map', (req, res) => {
    const credentials = extractCredentials(req);
    if (!credentials) {
        return res.status(401).send('Authorization header missing');
    }

    const { username, password } = credentials;
    const { buildingId } = req.body;

    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
        const buildingMapImage = getMapImageByBuildingId(buildingId);
        const buildingPath = path.join(__dirname, '..', 'data', 'images', buildingId);
        const filePath = path.join(buildingPath, buildingMapImage);

        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

function getImageByBuildingId(buildingId) {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.buildingImage : null;
}

function getMapImageByBuildingId(buildingId) {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.buildingMapImage : null;
}

export const appRoutes = router;
