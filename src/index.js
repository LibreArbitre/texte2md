const express = require('express');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const { marked } = require('marked');
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
            "script-src": ["'self'", "'unsafe-inline'"],
        },
    },
}));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static('public'));

// Setup DOMPurify
const window = new JSDOM('').window;
const dompurify = createDOMPurify(window);

// Setup Turndown with GFM (Tables support)
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});
turndownService.use(gfm);

// API Endpoint: HTML to Markdown
app.post('/api/convert', (req, res) => {
    const { html } = req.body;

    if (typeof html !== 'string') {
        return res.status(400).json({ error: 'Invalid input. Expecting HTML string.' });
    }

    try {
        const cleanHtml = dompurify.sanitize(html);
        const markdown = turndownService.turndown(cleanHtml);
        res.json({ markdown });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Failed to convert text.' });
    }
});

// API Endpoint: Markdown to HTML (Inverse)
app.post('/api/reverse', (req, res) => {
    const { markdown } = req.body;

    if (typeof markdown !== 'string') {
        return res.status(400).json({ error: 'Invalid input. Expecting Markdown string.' });
    }

    try {
        const rawHtml = marked.parse(markdown);
        const cleanHtml = dompurify.sanitize(rawHtml);
        res.json({ html: cleanHtml });
    } catch (error) {
        console.error('Reverse conversion error:', error);
        res.status(500).json({ error: 'Failed to convert markdown.' });
    }
});

app.listen(port, () => {
    console.log(`texte2md running at http://localhost:${port}`);
});
