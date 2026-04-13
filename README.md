# Aerodynamics × Biology Website

This project is a React-based educational website showcasing the intersection of aerodynamics and biology. It features a tab-based interface with admin capabilities.

## Structure
- **index.html**: Entry point, defines Tailwind theme.
- **app.js**: Main application logic, handles tab routing and authentication state.
- **components/**: Modular components for each tab and UI elements. Features an external Wind Turbine Explorer.
- **utils/storage.js**: Handles `localStorage` operations for data persistence.

## Maintenance
- Whenever components are updated, check if `storage.js` data structure needs migration (though this is a simple demo).
- Admin credentials are hardcoded in `TabAdmin.js`.
- This file should be updated if new features or major structural changes are added.