import express from "express";
import { jobs, users, assignedJobs, buildings } from '../data/data.js';
import fs from "fs"
import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const router = express.Router();





router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.name === username && u.password === password);

    if (user) {
        // Wenn der Benutzer gefunden wurde, sende die ID und Rollen zurück
        return res.status(200).json({
            success: true,
            id: user.id,
            roles: user.roles
        });
    } else {
        // Wenn Username oder Passwort falsch sind
        return res.status(401).json({
            success: false,
            message: 'Falscher Benutzername oder Passwort'
        });
    }
});

router.post('/jobs', async (req, res) => {
    const { username, password, userId } = req.body;

    const user = users.find(u => u.name === username && u.password === password);


    if (user) {
        // Finde alle Jobs, die dem Benutzer zugewiesen sind
        const assignedUserJobs = assignedJobs.filter(job => job.userID === user.id);



        if (assignedUserJobs.length > 0) {
            // Finde die Details zu jedem zugewiesenen Job in der jobs Liste
            const jobDetails = assignedUserJobs.map(assignedJob =>
                jobs.find(job => job.id === assignedJob.jobId)
            ).filter(job => job); // Filtert null-Werte, falls ein Job nicht gefunden wird
            console.log(jobDetails)
            if (jobDetails.length > 0) {
                // Gib die Details der zugewiesenen Jobs zurück
                return res.json({
                    success: true,
                    jobs: jobDetails
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Keine Details für zugewiesene Jobs gefunden'
                });
            }
        } else {
            // Kein Job zugewiesen
            return res.status(404).json({
                success: false,
                message: 'Keine Jobs für diesen Benutzer zugewiesen'
            });
        }
    } else {
        // Wenn Username oder Passwort falsch sind
        return res.status(401).json({
            success: false,
            message: 'Falscher Benutzername oder Passwort'
        });
    }
});





router.post('/thumbnail', (req, res) => {
    const { username, password, buildingId } = req.body; // Authentifizierungsdaten aus dem Body

    // Finde den Benutzer
    const user = users.find(u => u.name === username && u.password === password);

    if (user) {
        const buildingImage = getImageByBuildingId(buildingId);
        const buildingPath = path.join(__dirname, '..', 'data', 'images', buildingId);

        const filePath = path.join(buildingPath, buildingImage);

        console.log(filePath)
        if (fs.existsSync(filePath)) {
            // Wenn die Datei existiert, sende sie und setze fileFound auf true
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } else {
        // Wenn der Benutzer nicht authentifiziert ist
        res.status(401).send('Unauthorized');
    }
});


function getImageByBuildingId(buildingId) {
    const building = buildings.find(b => b.id === buildingId);
    console.log("building ", building.buildingImage)
    return building ? building.buildingImage : null;
}



router.post('/routeImage', (req, res) => {
    const { username, password, jobId, routeId } = req.body; // Authentifizierungsdaten aus dem Body

    // Finde den Benutzer
    const user = users.find(u => u.name === username && u.password === password);

    if (user) {

        const job = jobs.find(job => job.id === jobId);


        if (!job) {
            res.status(404).send('job not found');
            return;
        }
        const buildingId = job.buildingId;

        const buildingPath = path.join(__dirname, '..', 'data', 'images', buildingId);

        const route = job.route.find(route => route.id == routeId);

        if (!route) {
            res.status(404).send('route not found');
            return;
        }

        const filePath = path.join(buildingPath, route.routeImage);


        console.log(filePath)
        if (fs.existsSync(filePath)) {
            // Wenn die Datei existiert, sende sie und setze fileFound auf true
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } else {
        // Wenn der Benutzer nicht authentifiziert ist
        res.status(401).send('Unauthorized');
    }
});

export const appRoutes = router;
