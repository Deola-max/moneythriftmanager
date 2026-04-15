# GitHub Copilot Instructions for MoneyThriftManager

## Core Project Context:
This is a web application called MoneyThriftManager. Its primary goal is to help users manage personal thrift savings with distinct features for locked savings, emergency funds, and normal flexible savings. The project is intended to follow a three-tier architecture with a React.js frontend and a Node.js/Express.js backend API, using PostgreSQL as the database. The current state is a comprehensive frontend simulation using React, TypeScript, and localStorage.

## Technology Stack:
- **Frontend (Current):** React.js (v19.x), TypeScript, HTML5, CSS3 (Tailwind CSS). Key libraries/contexts: `react-router-dom`, React Context for state management.
- **Backend (Intended):** Node.js (v18.x), Express.js (v4.x), JavaScript/TypeScript. Key libraries: `express`, `pg`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`.
- **Database (Intended):** PostgreSQL (v15.x)
- **Package Manager:** npm (or inferred from existing setup)
- **API Integration (Example):** @google/genai for potential AI features.

## Key Documentation:
- **Project Requirements:** Detailed functional and non-functional requirements are in `/docs/Project_Requirements.md`. Refer to this for feature details and user stories.
- **Coding Guidelines:** Architectural overview, file structure, and coding style conventions are in `/docs/Coding_Guidelines.md`. Please adhere to these.
- **Handoff Report:** Current status and next steps for backend development are in `/docs/Manus_Handoff_Report.md`.

## Development Focus:
- **Current:** Enhancing and maintaining the React frontend application.
- **Future:** Building the backend API and integrating it with the frontend.
- Maintain clear separation between frontend (`/`) and backend (`/server` - when created).
- Follow RESTful principles for API design (when backend is built).
- Ensure secure coding practices, especially for authentication, authorization, and data handling (password hashing with bcrypt, input validation on backend).
- Write clear, commented, and well-typed (TypeScript) code as per coding guidelines.
- Adhere to `@google/genai` SDK usage guidelines if implementing features with Gemini API.
        ```