# texte2md

A simple and secure web service to convert Rich Text (HTML) to Markdown.

## Features
- **Fast:** Lightweight Node.js implementation.
- **Secure:** Uses `DOMPurify` for sanitization and `Helmet` for HTTP headers.
- **Easy to use:** Clean web interface for instant conversion.

## Tech Stack
- [Express](https://expressjs.com/) - Web framework
- [Turndown](https://github.com/mixmark-io/turndown) - HTML to Markdown converter
- [DOMPurify](https://github.com/cure53/dompurify) - HTML sanitizer
- [Pico.css](https://picocss.com/) - Minimal CSS framework
- [Docker](https://www.docker.com/) - Containerization

## Installation

### Local (Node.js)
```bash
npm install
npm start
```

### Docker
```bash
docker-compose up -d
```

## License
MIT
