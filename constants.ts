
export const APP_NAME = "MoneyThriftManager";

export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  CREATE_PLAN: "/create-plan",
  PLAN_DETAILS: "/plan/:planId", // Example, may not be fully implemented as a separate page
  ADMIN: "/admin",
};

export const LOCAL_STORAGE_KEYS = {
  USERS: "moneyThriftManager_users",
  CURRENT_USER_ID: "moneyThriftManager_currentUserId",
  SAVINGS_PLANS: "moneyThriftManager_savingsPlans",
  TRANSACTIONS: "moneyThriftManager_transactions",
};

export const PLAN_TYPE_OPTIONS = [
  { value: 'LOCKED', label: 'Locked Savings' },
  { value: 'EMERGENCY', label: 'Emergency Fund' },
  { value: 'NORMAL', label: 'Normal Savings' },
];
