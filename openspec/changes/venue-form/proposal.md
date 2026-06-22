# Venue Form

## Problem
Venue owners can't publish their locations from the frontend. The backend (POST /map/points) is ready but there's no UI.

## Solution
Add a "Publicar" button in the Navbar (when logged in) that opens a venue creation form.

## Implementation
- New VenueForm component with fields: name, description, type, address, phone, capacity, lat/lng
- NavigateContext to allow navigation from nested components
- Success redirects to the map view
