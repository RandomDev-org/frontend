# Frontend

## Purpose
React SPA for browsing music venues and events on an interactive map.

## Capabilities

### Map View
- Leaflet map with CartoDB dark tiles
- Venue markers colored by type
- GPS / IP geolocation (ipapi.co)
- Bounds-based venue fetching (findByBounds)
- Venue popup with details on click

### Sidebar
- Search venues by name or address
- Filter by genre (Jazz, Rock, Electrónica, Hip Hop, Indie, Blues)
- Venue list with cards showing name, type, address
- Distance display when using findNearby

### Authentication
- Login / Register modal with email + password
- JWT token stored in localStorage
- AuthContext provides user state globally
- API client attaches `Authorization: Bearer` header automatically

### Events
- Events listing page (currently empty state placeholder)

## Non-Functional Requirements
- Vite + React 19 + TypeScript 6
- TailwindCSS v4 + Radix UI primitives
- Communication via gateway at `VITE_API_URL` (default: `http://localhost:3000`)
