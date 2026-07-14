# texte2md

A simple and secure web service to convert Rich Text (HTML) to Markdown and back.

## Features
- **Fast:** Lightweight Node.js implementation.
- **Bidirectional:** Rich Text to Markdown and Markdown to sanitized Rich Text.
- **GFM support:** Preserves tables, task lists and other GitHub Flavored Markdown structures.
- **Secure:** Uses `DOMPurify`, a strict Content Security Policy and API rate limiting.
- **Private by design:** Conversion is performed by the local service; no content is sent to a third-party API.
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
npm test
npm start
```

### Docker
```bash
docker compose up -d --build
```

The container runs as a non-root user and exposes `/health` for health checks.

## License
MIT
