import axios from 'axios'

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

axiosClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token != null) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);