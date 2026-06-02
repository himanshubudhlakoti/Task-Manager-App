// import { AvailableCurrencies } from "src/app/libs/constants/enums";
export const paginationSettings = {
    ROW_PER_PAGE_OPTIONS: [10, 20, 40, 60, 100],
    LIMIT: 10
};

export const routesList = {
    LOGIN: { name: "Login", path: "/users/user-login" },
    LOGOUT: { name: "Logout", path: "/" },
    ADD_USER: { name: "Add User", path: "/users/sign-up" },
    TEAM_LEADS: { name: "Team Leads", path: "/auth-root/manager-panel/team-leads" },
    EMPLOYEES: { name: "Employees", path: "/auth-root/manager-panel/employees" },
    LEADS_TASK: { name: "Leads Task", path: "/auth-root/manager-panel/leads-task" },
    MANAGER_TASKS: { name: "My Tasks", path: "/auth-root/manager-panel/my-tasks" },
    EMPLOYEES_TASKS: { name: "My Tasks", path: "/auth-root/employee-panel/my-tasks" },
    TEAM_LEADS_TASKS: { name: "My Tasks", path: "/auth-root/team-lead-panel/my-tasks" },
    TEAM_LEADS_EMPLOYEES_TASKS: { name: "My Employees Tasks", path: "/auth-root/team-lead-panel/employees-tasks" },
    DASHBOARD: { name: "Dashboard", path: "/auth-root/dashboard" }
};

export const regexList = {
    // urlReg: '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
    urlReg: '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})',
    blockSpace: /[^\s]/,
    numbersOnly: '^[0-9]*$'
};