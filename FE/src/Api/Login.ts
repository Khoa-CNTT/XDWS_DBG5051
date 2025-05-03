
import { AxiosRequestConfig } from 'axios';
import { api } from '../Api/AxiosIntance';

// Đăng nhập
export const login = async (name: string, password: string) => {
    try {
        const response = await api.post('/login', { name, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }


};



export const authHeader = (): AxiosRequestConfig => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}


export const getCurrentApi = async (link: string, method: 'get' | 'post' | 'put' | 'delete') => {
    try {
        const response = await api[method](link);
        return response.data;
    } catch (error) {
        console.error(`${method} ${link} error:`, error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

export const getApiAdmin = async (link: string, method: 'get' | 'post' | 'put' | 'delete', authHeader: AxiosRequestConfig) => {
    try {
        const response = await api[method](`${link}`, authHeader);
        return response.data;
    } catch (error) {
        console.error(`${method} ${link} error:`, error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}
