import axios from 'axios';
import { IDataTableApi, IDeleteDataTable } from '@/types/dataTable';
import { DetailContentProps as DiscountDetailContentProps } from '@/pages/private/Discount/Detail';
import { DetailContentProps as TransporterDetailContentProps } from '@/pages/private/FollowTransporters/Index';
export const apiUrl = 'https://transpotation-nest.onrender.com/v1/';

export const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const login = async ({ email, password }: { email: string; password: string; }) => {
    try {
        const response = await instance.post(`auth/login`, { email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const register = async ({ email, password, name, role }: { email: string; password: string; name: string; role: string; }) => {
    try {
        const response = await instance.post(`auth/register`, { email, password, name, role });
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const refresh = async ({ token }: { token: string }) => {
    try {
        const response = await instance.post(`auth/refresh`, { token });
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}


export const me = async () => {
    try {
        const response = await instance.get(`auth/me`);
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const getDataTable = async (data: IDataTableApi) => {
    try {
        const params = new URLSearchParams(Object.entries(data.query).reduce((acc: { [key: string]: string }, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {})).toString();
        const response = await instance.get(`${data.dataUrl}?${params}`);

        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const deleteDataTable = async (data: IDeleteDataTable) => {
    try {
        const response = await instance.delete(data.deleteUrl);
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const postDiscount = async (data: DiscountDetailContentProps) => {
    try {
        const response = await instance.post(
            '/transporters/discounts',
            data);
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const postTransporterFollow = async (data: TransporterDetailContentProps) => {
    try {
        const response = await instance.post(
            '/customers/transporters',
            data);
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}


export const deleteTransporterFollow = async (data: TransporterDetailContentProps) => {
    try {
        const response = await instance.delete(
            `/customers/transporters/${data.transporterId}`,
        );
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const getDiscountbyCode = async ({
    discountCode, transporter
}: {
    discountCode: string;
    transporter: string;
}) => {
    try {
        const response = await instance.get(`/transporters/discounts/${discountCode}?transporter=${transporter}`);
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}

export const postCargos = async (data: any) => {
    try {
        const response = await instance.post(
            '/customers/create-cargo',
            data);
        return response.data;
    } catch (error: any) {
        throw new Error(String(error.response.data.message));
    }
}