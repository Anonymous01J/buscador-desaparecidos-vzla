const express = require('express');
const cors = require('cors');
const { searchAll } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoint to search data in real-time
app.get('/api/people', async (req, res) => {
    const query = req.query.q || '';
    
    if (!query) {
        return res.json([]);
    }
    
    try {
        const results = await searchAll(query);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Error performing search' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('Real-time search API is ready.');
});
