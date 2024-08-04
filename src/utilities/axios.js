import axios from 'axios';

import { env } from '../utilities/function';
import { getCookie } from './cookies';

const axiosInstance = axios.create({
    baseURL: env('SERVER'),
});

axiosInstance.interceptors.request.use(
    function (config) {
        const token = getCookie('_auth');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosInstance;
