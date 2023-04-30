const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const python = require("child_process");
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const server = http.createServer(app);
const port = 3005;

// configure cors
app.use(cors());

// configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/projects-cards', async (req, res) => {
    try{
        const url = (process.env.PROJECTS).toString();
        const response = await axios.get(url);
        const data = response.data;
        res.send(data);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
    }
});

app.post('/api/projects-cards', async (req, res) => {
    // Before sending the request body to the server, the information should be in JSON format!

    try {
        const url = (process.env.PROJECTS).toString();
        const response = await axios.get(url);
        const data = response.data;

        const lang = "pt";
        const objects = data[lang];
        let id = 0;

        for (const obj of objects)
            if (obj.id > id) 
                id = obj.id;
                
        id++;

        const { title, subtitle, description, info } = req.body

        const newObj = {
            id,
            title,
            subtitle,
            description,
            info
        }

        data[lang].push(newObj);

        res.send("You have made a POST into the server and get the following information: \n" + JSON.stringify(data));        

    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
    }
})

server.listen(port, () => console.log('listening on port 3005'));