import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { appRoutes } from './routes/router.js';


dotenv.config();

const app = express();

const corsOptions = {       //not in use; fix later
    origin: 'http://127.0.0.1:5500', // Erlaube nur Anfragen von diesem Origin
    methods: 'GET,POST,PUT', // Erlaube nur diese HTTP-Methoden
};

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    console.log(req.body)
    next();
});

//app.use('/data/images', express.static(path.join(__dirname, 'images')));
app.use('/api', appRoutes);


app.listen(5500, () => {
    console.log("server is running and listening on port 5500");
});
