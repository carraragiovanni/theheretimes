require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const defaultPort = 3000;

// Top 5 most populous US cities with their coordinates
const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, population: 8336817 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3979576 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298, population: 2693976 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698, population: 2320268 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740, population: 1680992 }
];

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// News API endpoint
app.get('/api/news/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.NEWS_API_KEY;
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(city)}&apiKey=${apiKey}&pageSize=8`
        );
        
        if (!response.ok) {
            throw new Error(`News API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
});

// Cities API endpoint
app.post('/api/cities', async (req, res) => {
    try {
        const { bounds } = req.body;
        
        if (!bounds || !bounds.north || !bounds.south || !bounds.east || !bounds.west) {
            return res.status(400).json({ error: 'Invalid bounds provided' });
        }

        const username = process.env.GEONAMES_USERNAME;
        if (!username) {
            throw new Error('GeoNames username not configured');
        }

        // Construct the GeoNames API URL
        const url = new URL('http://api.geonames.org/citiesJSON');
        url.searchParams.append('north', bounds.north);
        url.searchParams.append('south', bounds.south);
        url.searchParams.append('east', bounds.east);
        url.searchParams.append('west', bounds.west);
        url.searchParams.append('username', username);
        url.searchParams.append('maxRows', '50'); // Get more cities to filter by population
        url.searchParams.append('featureClass', 'P'); // Only populated places

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`GeoNames API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status) {
            throw new Error(`GeoNames API error: ${data.status.message}`);
        }

        // Process the cities data
        const cities = data.geonames
            .map(city => ({
                name: city.name,
                lat: parseFloat(city.lat),
                lng: parseFloat(city.lng),
                population: parseInt(city.population) || 0
            }))
            .filter(city => city.population > 0) // Only include cities with population data
            .sort((a, b) => b.population - a.population)
            .slice(0, 5); // Get top 5 most populous cities

        res.json(cities);
    } catch (error) {
        console.error('Error in /api/cities:', error);
        res.status(500).json({ 
            error: 'Failed to fetch cities',
            details: error.message 
        });
    }
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to start server on an available port
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log('Press Ctrl+C to stop the server');
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

// Start the server
startServer(defaultPort); 