import * as React from 'react';
import { PropsWithChildren } from 'react';
import { router } from '@inertiajs/react';
import { api } from '@/Services/api';
// Types
import { AuthContext, AuthenticatedUser, AuthenticationForm } from './types';

export const AuthenticationContext = React.createContext({} as AuthContext);

export function AuthenticationProvider({ children }: PropsWithChildren) {

    const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
    const isAuthenticated = !!user;

    React.useEffect(() => {
        if (/\/home/.test(window.location.pathname)) {
            refreshUserData();
        }
    }, []);

    async function refreshUserData() {
        try {
            const response = await api.get('api/auth/session');
            setUser(response.data.user);
            localStorage.setItem('authenticated-user-data', JSON.stringify(response.data.user));
        } catch (e) {
            throw e;
        }
    }

    async function signInAdmin(form: AuthenticationForm) {
        try {
            const response = await api.post('api/auth/admin/signin', form);
            setUser(response.data.user);
            localStorage.setItem('authenticated-user-data', JSON.stringify(response.data.user));
            router.get(response.data.next);
        } catch (e) {
            throw e;
        }
    }

    async function signInTenant(form: AuthenticationForm) {
        try {
            const response = await api.post('api/auth/manager/signin', form);
            setUser(response.data.user);
            localStorage.setItem('authenticated-user-data', JSON.stringify(response.data.user));
            router.get(response.data.next);
        } catch (e) {
            throw e;
        }
    }

    async function signInUser(form: AuthenticationForm) {
        try {
            const response = await api.post('api/auth/user/signin', form);
            setUser(response.data.user);
            localStorage.setItem('authenticated-user-data', JSON.stringify(response.data.user));
            router.get(response.data.next);
        } catch (e) {
            throw e;
        }
    }

    async function signOut() {
        try {
            await api.post('api/auth/signout', {});
            setUser(null);
            localStorage.removeItem('authenticated-user-data');
            router.get("/signin");
        } catch (e) {
            throw e;
        }
    }

    return (
        <AuthenticationContext.Provider value={{ user, isAuthenticated, signInAdmin, signInTenant, signInUser, signOut }}>
            {children}
        </AuthenticationContext.Provider>
    )

}

export function useAuthentication() {
    return React.useContext(AuthenticationContext);
}