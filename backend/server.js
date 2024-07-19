const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 3009;

app.use(cors({
    origin: 'http://localhost:3004', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

app.use(express.json());

const authRouter = require('./routes/auth');
const listsRouter = require('./routes/lists');

app.use('/auth', authRouter);
app.use('/lists', listsRouter);

app.get('/proxy/http-dog/:code', async (req, res) => {
    try {
        console.log(`Fetching data for code: ${req.params.code}`);
        const response = await axios.get(`https://http.dog/${req.params.code}`);
        const result = {
            responseCode: req.params.code,
            imageUrl: response.request.res.responseUrl
        };
        res.json([result]); // Ensure the response is an array
    } catch (error) {
        console.error('Error fetching data from http.dog:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        res.status(500).send('Error fetching data from http.dog');
    }
});

app.listen(port, () => {
    console.log("Server is running on port 3009");
});