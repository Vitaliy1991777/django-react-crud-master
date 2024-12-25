// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api/',
// });

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default axiosInstance;

// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api/',
// });

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default axiosInstance;


// src/api/axios.js





// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api/',
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // Добавляем перехватчик для добавления токена к каждому запросу
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Добавляем перехватчик для обновления токена
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Если ошибка 401 и это не повторный запрос
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const refreshToken = localStorage.getItem('refreshToken');
//                 const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
//                     refresh: refreshToken
//                 });

//                 const { access } = response.data;
//                 localStorage.setItem('accessToken', access);

//                 // Повторяем оригинальный запрос с новым токеном
//                 originalRequest.headers['Authorization'] = `Bearer ${access}`;
//                 return axiosInstance(originalRequest);
//             } catch (error) {
//                 // Если не удалось обновить токен, перенаправляем на страницу входа
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 window.location.href = '/login';
//                 return Promise.reject(error);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;


import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Изменяем названия токенов для соответствия с Login.js
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Изменяем название токена на refresh_token
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken
                });

                const { access } = response.data;
                // Обновляем название токена
                localStorage.setItem('access_token', access);

                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;