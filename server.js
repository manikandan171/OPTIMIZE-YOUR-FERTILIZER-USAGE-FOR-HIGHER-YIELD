const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
require('dotenv').config();

// MongoDB Atlas connection URI
const mongoURI = "mongodb+srv://manikandans22msc:12345@cluster0.amrtggi.mongodb.net/fertilizer_optimizer?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Define schema and model
const formDataSchema = new mongoose.Schema({
    cropType: { type: String, required: true },
    soilType: { type: String, required: true },
    climateConditions: { type: String, required: true },
    currentNutrientLevel: { type: Number, required: true },
    fieldSize: { type: Number, required: true },
    fertilizerType: { type: String, required: true }
});

const FormData = mongoose.model('FormData', formDataSchema);

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        return res.end();
    }

    // Parse URL
    const parsedUrl = url.parse(req.url, true);

    // Handle GET request for root route
    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to the Fertilizer Optimizer API!');
        return;
    }

    // Handle POST request to /submit
    if (parsedUrl.pathname === '/submit' && req.method === 'POST') {
        let body = '';

        // Listen for data
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        // End of data
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                // Validate required fields
                const { cropType, soilType, climateConditions, currentNutrientLevel, fieldSize, fertilizerType } = data;
                if (!cropType || !soilType || !climateConditions || currentNutrientLevel == null || fieldSize == null || !fertilizerType) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'All fields are required.' }));
                }

                // Save data to MongoDB
                const formData = new FormData(data);
                await formData.save();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Data saved successfully!' }));
            } catch (error) {
                console.error('Error saving data:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error saving data. Please try again.' }));
            }
        });

        return;
    }

    // Handle unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
