export interface User {
    userId: number;
    email: string;
    username: string;
    password: string;
    isAdmin: boolean;
    roles: string;
    permissions: string;
}