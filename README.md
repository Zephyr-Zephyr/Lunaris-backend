# Lunaris Backend

Modernes Node.js + TypeScript Backend für die Lunaris Website mit Login, Authentifizierung und Email-Versand.

## Features

- ✅ Benutzerregistrierung und Login (JWT Authentication)
- ✅ PostgreSQL Datenbank Integration
- ✅ Email-Versand (Willkommen-Email, Passwort-Reset)
- ✅ Password Hashing mit bcrypt
- ✅ CORS Support
- ✅ TypeScript für Type Safety
- ✅ Express.js REST API

## Voraussetzungen

- Node.js 16+ installiert
- PostgreSQL 12+ installiert
- npm oder yarn

## Installation

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopiere die `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

Bearbeite `.env` mit deinen Einstellungen:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lunaris_db
DB_USER=postgres
DB_PASSWORD=dein_passwort

# JWT
JWT_SECRET=dein_geheimer_schluessel

# Email (Gmail)
EMAIL_USER=deine_email@gmail.com
EMAIL_PASSWORD=dein_app_passwort

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. PostgreSQL Datenbank erstellen

```bash
# Mit psql
psql -U postgres
CREATE DATABASE lunaris_db;
\q
```

## Starten des Servers

### Entwicklung (mit Hot-Reload):
```bash
npm run dev
```

### Produktion:
```bash
npm run build
npm start
```

Der Server läuft dann unter `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Registrierung
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "passwort123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "passwort123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Benutzerprofil (Protected Route)
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## Projektstruktur

```
src/
├── config/
│   └── database.ts       # PostgreSQL Verbindung
├── controllers/
│   └── AuthController.ts # Login/Register Handler
├── middleware/
│   └── auth.ts          # JWT Authentication Middleware
├── services/
│   ├── AuthService.ts   # Authentifizierung Logic
│   └── EmailService.ts  # Email-Versand
├── utils/
│   └── jwt.ts           # JWT Hilfsfunktionen
└── server.ts            # Express Server Setup
```

## Testing mit cURL

```bash
# Health Check
curl http://localhost:5000/health

# Registrierung
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Profil abrufen (mit Token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/profile
```

## Nächste Schritte

1. Email-Konfiguration vollständig einrichten (Gmail App Password)
2. Frontend mit React/HTML verbinden
3. Weitere Endpoints hinzufügen (Passwort-Reset, User Update, etc.)
4. Database Migrations einrichten
5. Tests schreiben
6. Logging und Monitoring aufbauen

## Lizenz

ISC
