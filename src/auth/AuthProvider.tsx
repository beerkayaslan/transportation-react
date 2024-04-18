import React, { useEffect, useMemo } from "react";
import { me, refresh } from '@/api/index';
import useCookie from 'react-use-cookie';
import { instance } from "@/api/index";
import { useQueryClient } from "@tanstack/react-query";

export enum AuthStatus {
    LOADING = 'LOADING',
    LOGGED_IN = 'LOGGED_IN',
    LOGGED_OUT = 'LOGGED_OUT',
}

export enum Role {
    TRANSPORTER = 'transporter',
    CUSTOMER = 'customer'
}

interface User {
    accessToken: string;
    refreshToken: string;
    user?: {
        _id: string;
        email: string;
        name: string;
        role: Role
    }
}

interface AuthContextType {
    login: AuthStatus;
    setUserCookie: (value: string) => void;
    user?: User | null;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [login, setLogin] = React.useState<AuthStatus>(AuthStatus.LOADING);
    const [userCookie, setUserCookie] = useCookie('user', '');
    const queryClient = useQueryClient();

    const user = useMemo(() => userCookie ? JSON.parse(userCookie) as User : null, [userCookie]);

    useEffect(() => {

        if (!user) {
            setLogin(AuthStatus.LOGGED_OUT);
            (async () => {
                await queryClient.cancelQueries();
                await queryClient.removeQueries();
            })();
            return;
        }

        instance.defaults.headers.common['Authorization'] = 'Bearer ' + user.accessToken;
        const myInterceptors = instance.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response.status === 401) {
                refresh({ token: user.refreshToken }).then((response: any) => {
                    setUserCookie(JSON.stringify(response));
                    console.log('refreshed');
                }).catch(() => {
                    setUserCookie('');
                });
            }
            return Promise.reject(error);;
        });

        me().then(() => {
            setLogin(AuthStatus.LOGGED_IN);
        });

        return () => {
            instance.interceptors.response.eject(myInterceptors);
        }
    }, [user]);

    const value = { login, setUserCookie, user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}