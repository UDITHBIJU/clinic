import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes("/api/auth/login")
		) {
			originalRequest._retry = true;
			try {
				const { data } = await axios.post(
					`${import.meta.env.VITE_API_URL}/auth/refresh-token`,
					{},
					{ withCredentials: true }
				);
				localStorage.setItem("accessToken", data.accessToken);
				originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem("accessToken");
				window.location.href = "/login";
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
