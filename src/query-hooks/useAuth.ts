import { useMutation } from '@tanstack/react-query';
import { login, register } from '../api/index';

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string; }) => login({ email, password })
    });
}

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ email, password, role, name }: { email: string; password: string; role: string; name: string; }) => register({ email, password, role, name })
    });
}