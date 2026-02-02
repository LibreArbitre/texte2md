# texte2md

Un service web simple et sécurisé pour convertir du texte enrichi (HTML) en Markdown.

## Fonctionnalités
- **Rapide :** Implémentation légère sous Node.js.
- **Sécurisé :** Utilise `DOMPurify` pour la désinfection et `Helmet` pour les en-têtes HTTP.
- **Facile à utiliser :** Interface web épurée pour une conversion instantanée.

## Stack Technique
- [Express](https://expressjs.com/) - Framework web
- [Turndown](https://github.com/mixmark-io/turndown) - Convertisseur HTML vers Markdown
- [DOMPurify](https://github.com/cure53/dompurify) - Nettoyage HTML
- [Pico.css](https://picocss.com/) - Framework CSS minimaliste
- [Docker](https://www.docker.com/) - Conteneurisation

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

## Licence
MIT
