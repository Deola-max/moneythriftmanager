# Project Requirements Document: MoneyThriftManager

## 1. Introduction
This document outlines the functional and non-functional requirements for the MoneyThriftManager, a web application designed to help users manage personal thrift savings with distinct features for locked savings, emergency funds, and normal flexible savings. The primary goal is to provide a user-friendly, secure, and efficient platform that promotes disciplined savings habits.

## 2. User Roles
*   **User:** Individuals who register and use the platform to manage their savings.
*   **Administrator (Future Scope):** Manages system operations, user accounts, and oversees the platform.

## 3. Functional Requirements

| Requirement ID | Description                                                                                                | User Story                                                                                               | Expected Behavior/Outcome                                                                                                                                                                                              | Priority |
|----------------|------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| **MUS FUNCTIONAL REQUIREMENTS** |                                                                                                            |                                                                                                          |                                                                                                                                                                                                                        |          |
| FR001          | User Registration                                                                                          | As a new user, I want to create an account using my full name, email, and password so I can start using the application. | User provides full name, email, and password. System validates input (e.g., email format, password strength). Password is hashed using bcrypt. User account is created and stored in PostgreSQL. User is notified of success/failure. | High     |
| FR002          | User Login                                                                                                 | As a registered user, I want to log in with my email and password so I can access my savings dashboard.    | User provides email and password. System authenticates credentials against database. On success, a session is established, and user is redirected to their dashboard. On failure, an error message is shown.                   | High     |
| FR003          | Create Locked Savings Plan                                                                                 | As an authenticated user, I want to create a locked savings plan with a name, target amount, and maturity date so I can save for a specific long-term goal without accessing the funds prematurely. | Authenticated user navigates to "Create Locked Plan". User inputs plan name, target amount, and a future maturity date. System validates input. Plan is created and linked to the user. Withdrawal before maturity is blocked. | High     |
| FR004          | View Savings Dashboard (Locked Plans List)                                                                 | As an authenticated user, I want to see a list of my locked savings plans on my dashboard so I can track their status. | Upon login, user sees a dashboard. Dashboard displays a section listing all their created locked savings plans, showing plan name, target amount, and maturity date for each.                                       | High     |
| **POST-MUS FUNCTIONAL REQUIREMENTS** |                                                                                                            |                                                                                                          |                                                                                                                                                                                                                        |          |
| FR005          | Create Emergency Fund Plan                                                                                 | As an authenticated user, I want to set up an emergency fund with a target amount so I can save for unexpected expenses. | User can create an emergency fund, specify a target amount. Deposits can be made. Withdrawals are permitted.                                                                                                       | Medium   |
| FR006          | Create Normal Savings Account                                                                              | As an authenticated user, I want a general savings account where I can deposit and withdraw money flexibly.  | User has access to a normal savings account. Deposits and withdrawals are flexible.                                                                                                                                | Medium   |
| FR007          | Deposit Funds to Savings Plan/Account                                                                      | As an authenticated user, I want to deposit funds into my various savings plans/accounts.                    | User selects a savings plan/account and specifies an amount to deposit. System updates the balance. (Simulated transactions for now).                                                                              | Medium   |
| FR008          | Withdraw Funds (Emergency/Normal)                                                                          | As an authenticated user, I want to withdraw funds from my emergency or normal savings accounts when needed. | User selects an eligible account and specifies an amount to withdraw. System validates request and updates balance. (Simulated transactions).                                                                      | Medium   |
| FR009          | View Transaction History                                                                                   | As an authenticated user, I want to view a history of my deposits and withdrawals for each savings plan/account. | System records all transactions (date, type, amount, plan/account). User can view this history.                                                                                                                        | Medium   |
| FR010          | Edit User Profile                                                                                          | As an authenticated user, I want to update my profile information (e.g., change password).                   | User can access a profile settings page to update their details. Password change requires current password.                                                                                                                | Low      |
| FR011          | Set Savings Goals (Visual)                                                                                 | As an authenticated user, I want to see visual progress towards my savings goals.                            | Dashboard shows progress bars or visual indicators for savings plans with targets.                                                                                                                                     | Low      |
| FR012          | Password Recovery                                                                                          | As a user who forgot my password, I want to be able to reset it securely.                                | User can request a password reset via email. System sends a unique link to reset password.                                                                                                                             | Medium   |

## 4. Non-Functional Requirements

| Requirement ID | Category         | Description                                                                                                |
|----------------|------------------|------------------------------------------------------------------------------------------------------------|
| NFR001         | Security         | All user passwords must be securely hashed (e.g., using bcrypt) before storage.                            |
| NFR002         | Security         | Communication between client and server should be over HTTPS in a production environment.                  |
| NFR003         | Performance      | Application should load the main dashboard within 3 seconds on a stable internet connection.                 |
| NFR004         | Usability        | The user interface must be intuitive and easy to navigate for users with basic computer literacy.            |
| NFR005         | Reliability      | The system should maintain data integrity for all financial transactions and user account information.      |
| NFR006         | Maintainability  | Code should be well-structured, commented, and follow guidelines defined in `Coding_Guidelines.md`.          |
| NFR007         | Scalability      | The architecture should allow for future scaling to accommodate a growing number of users and features.    |
| NFR008         | Browser Comp.    | The web application should be compatible with the latest versions of major browsers (Chrome, Firefox, Safari, Edge). |

## 5. Data Model (Conceptual for PostgreSQL)

*   **Users:**
    *   `user_id` (Primary Key, SERIAL)
    *   `full_name` (VARCHAR)
    *   `email` (VARCHAR, UNIQUE, NOT NULL)
    *   `password_hash` (VARCHAR, NOT NULL)
    *   `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
*   **SavingsPlans (for Locked Plans initially):**
    *   `plan_id` (Primary Key, SERIAL)
    *   `user_id` (Foreign Key to Users)
    *   `plan_name` (VARCHAR, NOT NULL)
    *   `plan_type` (VARCHAR, e.g., 'LOCKED', 'EMERGENCY', 'NORMAL')
    *   `target_amount` (DECIMAL)
    *   `current_balance` (DECIMAL, DEFAULT 0.00)
    *   `maturity_date` (DATE, for 'LOCKED' type)
    *   `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
*   **Transactions:**
    *   `transaction_id` (Primary Key, SERIAL)
    *   `plan_id` (Foreign Key to SavingsPlans)
    *   `user_id` (Foreign Key to Users)
    *   `transaction_type` (VARCHAR, e.g., 'DEPOSIT', 'WITHDRAWAL')
    *   `amount` (DECIMAL, NOT NULL)
    *   `transaction_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
    *   `description` (TEXT, optional)
