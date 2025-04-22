require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

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

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server');
}); 