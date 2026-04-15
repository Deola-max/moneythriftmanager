# Coding Guidelines: MoneyThriftManager

## 1. Introduction
These guidelines are established to ensure consistency, maintainability, and quality in the codebase for the MoneyThriftManager project. All contributors are expected to adhere to these standards.

## 2. Architecture
The project follows a **Three-Tier Architecture**:
*   **Presentation Tier (Frontend):** React.js application located in the `/client` directory. Responsible for UI and user interaction.
*   **Application Tier (Backend API):** Node.js/Express.js application located in the `/server` directory. Responsible for business logic, API endpoints, and communication with the database.
*   **Data Tier (Database):** PostgreSQL. Responsible for persistent data storage.

This separation of concerns should be maintained throughout development.
*(Note: The current existing application is frontend-only. These guidelines apply to the intended full-stack architecture.)*

## 3. Technology Stack
*   **Frontend:** React.js (v18.x), HTML5, CSS3, JavaScript (ES6+), Tailwind CSS. (Current app uses React.js, TypeScript, Tailwind CSS)
*   **Backend:** Node.js (v18.x), Express.js (v4.x)
*   **Database:** PostgreSQL (v15.x)
*   **Primary Language:** JavaScript (Current frontend uses TypeScript)
*   **Package Management:** npm
*   **Password Hashing:** bcrypt
*   **Version Control:** Git

## 4. File Structure Philosophy
*   **`/client`:** Contains all frontend React application code. (Or root for current standalone frontend)
    *   `/src/components`: Reusable UI components.
    *   `/src/pages` (or `/src/views`): Top-level page components.
    *   `/src/services` or `/src/hooks`: API call functions and custom hooks.
    *   `/src/contexts` (or `/src/store`): State management (e.g., React Context).
    *   `/src/assets`: Static assets like images, global CSS.
    *   `/src/types`: TypeScript type definitions.
    *   `/src/utils`: Utility functions.
*   **`/server`:** Contains all backend Node.js/Express.js API code.
    *   `/server/config`: Configuration files (database, environment variables).
    *   `/server/routes`: API route definitions.
    *   `/server/controllers`: Request handlers and business logic.
    *   `/server/models`: Database interaction logic (if not using a separate ORM layer initially).
    *   `/server/middleware`: Custom Express middleware.
    *   `/server/utils`: Utility functions.
*   **`/docs`:** Project documentation, including `Project_Requirements.md`, `Coding_Guidelines.md`, and `Manus_Handoff_Report.md`.

## 5. Coding Style ("Vibe")
*   **JavaScript (ES6+)/TypeScript:**
    *   Use modern JavaScript features (arrow functions, const/let, template literals, async/await).
    *   For TypeScript, leverage static typing for improved code quality and maintainability.
    *   Follow a consistent style (e.g., Airbnb JavaScript Style Guide is a good reference, but consistency within the project is key). Use a linter like ESLint and a formatter like Prettier, configured for the project.
    *   **Clarity:** Prioritize clear, readable code. Use descriptive variable, function, and type names.
    *   **Comments:**
        *   Write JSDoc-style comments for functions, especially for API endpoints and complex business logic.
        *   Use inline comments to explain non-obvious parts of the code.
    *   **Modularity:** Break down complex functions and components into smaller, manageable, and reusable pieces.
    *   **Error Handling:** Implement robust error handling, especially for API calls and database interactions. Use try/catch blocks for asynchronous operations. Return meaningful error messages.
    *   **Security:**
        *   Always validate and sanitize user input on the backend.
        *   Use parameterized queries or an ORM to prevent SQL injection.
        *   Store sensitive information like API keys and database credentials in environment variables (`.env` files, not committed to Git).
*   **React.js:**
    *   Prefer functional components with Hooks over class components.
    *   Structure components logically. Keep components focused on a single responsibility.
    *   Use TypeScript for props and state definitions.
*   **Node.js/Express.js (for backend development):**
    *   Use asynchronous operations (Promises, async/await) for non-blocking I/O.
    *   Organize routes clearly. Use Express Router for modular route handling.
    *   Implement proper status codes for API responses (200, 201, 400, 401, 403, 404, 500, etc.).
*   **General:**
    *   **DRY (Don't Repeat Yourself):** Avoid code duplication by creating reusable functions and components.
    *   **KISS (Keep It Simple, Stupid):** Prefer simpler solutions over complex ones where possible.
    *   **Version Control:**
        *   Commit frequently with clear, descriptive commit messages.
        *   Use feature branches for new development and bug fixes.
        *   Ensure `.env` files and `node_modules` are in `.gitignore`.

## 6. Testing (Future MUS Enhancement / Backend Development)
*   Aim for unit tests for critical backend logic (e.g., savings rules, authentication).
*   Consider integration tests for API endpoints.
*   Frontend testing (e.g., React Testing Library) for key components.

## 7. Environment Variables
*   Use a `.env` file in the `/server` directory (when backend is developed) to store sensitive configuration like database connection strings, JWT secrets, etc.
*   Provide a `.env.example` file with placeholder values.
*   Access environment variables using `process.env.VARIABLE_NAME`.
*   For the frontend, API keys (like Gemini API key) should be managed via environment variables (e.g., `process.env.API_KEY` provided by the build/hosting environment).
