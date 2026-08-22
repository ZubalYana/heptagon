## Backend Architecture
- Feature-folder structure: each feature (tasks, days, auth) has its own folder
- Layers: repository → service → routes + schemas if needed. No controller layer — routes call services directly.
- Every query on Task/Day schemas MUST be scoped by userId. 
- Auth middleware (verifyAdmin, verifyUser) must be applied at the route level, not assumed to be handled elsewhere.

## Frontend Architecture
- Also follows feature-first pattern. All feature-specific functionality lives in /src/components/features 
- Separate folders for modals, pages, helpers and interfaces

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React + Vite + Tailwind.css, Lucide for icons
- Do not suggest new dependencies without flagging them first