export interface AuthenticatedUser {
    id: string;
    name: string;
    role: { id: string, name: string };
    modules: {
        gadmin: { name: string, read: boolean, write: boolean },
        gpc: { name: string, read: boolean, write: boolean },
        gpv: { name: string, read: boolean, write: boolean },
        gos: { name: string, read: boolean, write: boolean },
        ge: { name: string, read: boolean, write: boolean },
    };
}

export interface AuthContext {
    user: AuthenticatedUser | null;
    isAuthenticated: boolean;
    signInAdmin: Function;
    signInUser: Function;
    signInTenant: Function;
    signOut: Function;
}

export interface AuthenticationForm {
    email: string;
    password: string;
}