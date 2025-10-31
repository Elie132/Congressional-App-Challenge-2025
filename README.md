# ShelfShare

A local web prototype that connects food donors with food receivers to reduce community food waste.

ShelfShare is a web application designed to address food waste by creating a platform where restaurants, grocery stores, and individuals can list surplus food for pickup by food banks, shelters, and community organizations. The application provides a simple interface for posting food donations and managing pickup requests within local communities.

## Status

This is a local web prototype built for the Congressional App Challenge 2025. The application currently runs only on the developer's laptop and is not deployed to any public hosting service. The backend was bootstrapped using Chef by Convex to accelerate development, but all core functionality was implemented specifically for this project.

## Features (v1)

- Food listing creation with photo upload and basic details
- Browse available food donations by category and location
- Claim system for receivers to request food pickups
- Basic donor and receiver dashboards for managing listings and requests
- User profile setup with role selection (donor/receiver)
- Food safety guidelines page
- Local image storage for food photos
- Anonymous authentication for development testing

## Planned Improvements (v2.0)
 
- Public deployment and hosting infrastructure
- Enhanced user authentication and account management
- Push notifications for new listings and claim updates
- Advanced filtering and search capabilities
- Interactive map view for location-based discovery
- Messaging system between donors and receivers
- Mobile application development
- Integration with food safety certification systems

## Local Setup

```bash
git clone https://github.com/Elie132/Congressional-App-Challenge-2025.git
cd Congressional-App-Challenge-2025
npm install
npm run dev
```

The application will be available at `http://localhost:5173` in your web browser.

## Project Structure

```
├── src/                    # React frontend application
│   ├── components/         # UI components and pages
│   ├── utils/              # Utility functions and helpers
│   └── App.tsx            # Main application component
├── convex/                # Backend database functions
│   ├── schema.ts          # Database schema definitions
│   ├── listings.ts        # Food listing operations
│   ├── claims.ts          # Claim management functions
│   └── users.ts           # User management functions
├── public/                # Static assets and images
└── package.json          # Project dependencies and scripts
```

## Why It Matters

Food waste represents a significant environmental and social challenge, with millions of pounds of edible food discarded daily while communities face food insecurity. ShelfShare aims to bridge this gap by providing a simple, accessible platform for local food redistribution. By connecting surplus food with organizations that serve those in need, the application supports both environmental sustainability and community welfare initiatives.

## License

MIT
