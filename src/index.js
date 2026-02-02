const express = require('express');
const TurndownService = require('turndown');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'"], // Needed for simple UI logic
        },
    },
}));
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(express.static('public'));

// Setup DOMPurify
const window = new JSDOM('').window;
const dompurify = createDOMPurify(window);

// Setup Turndown
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

// API Endpoint
app.post('/api/convert', (req, res) => {
    const { html } = req.body;

    if (typeof html !== 'string') {
        return res.status(400).json({ error: 'Invalid input. Expecting HTML string.' });
    }

    try {
        // 1. Sanitize HTML to prevent XSS
        const cleanHtml = dompurify.sanitize(html);
        
        // 2. Convert to Markdown
        const markdown = turndownService.turndown(cleanHtml);
        
        res.json({ markdown });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Failed to convert text.' });
    }
});

app.listen(port, () => {
    console.log(`texte2md running at http://localhost:${port}`);
});
