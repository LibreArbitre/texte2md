# texte2md

Un service web simple et sécurisé pour convertir du texte enrichi (HTML) en Markdown, et inversement.

## Fonctionnalités
- **Rapide :** Implémentation légère sous Node.js.
- **Bidirectionnel :** Texte enrichi vers Markdown et Markdown vers texte enrichi assaini.
- **Compatible GFM :** Conserve les tableaux, listes de tâches et autres structures GitHub Flavored Markdown.
- **Sécurisé :** Utilise `DOMPurify`, une politique CSP stricte et une limitation du débit de l'API.
- **Respectueux des données :** La conversion est réalisée par le service local, sans envoi vers une API tierce.
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
npm test
npm start
```

### Docker
```bash
docker compose up -d --build
```

Le conteneur s'exécute avec un utilisateur non privilégié et expose `/health` pour les contrôles d'état.

## Licence
MIT
