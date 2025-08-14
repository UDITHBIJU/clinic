import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"user" | "doctor">("user");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); 
		try {
			const { data } = await api.post(`/api/auth/${role}/login`, {
				email,
				password,
			});
			localStorage.setItem("accessToken", data.accessToken);
			navigate(role === "user" ? "/booking" : "/doctor/leave");
		} catch (err: any) {
			const msg = err.response?.data?.message || "Login failed";
			setError(msg);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50  ">
			<form
				onSubmit={handleLogin}
				className="w-full max-w-md p-6 bg-white rounded-lg shadow space-y-4"
			>
				<h1 className="text-2xl font-semibold text-center">Login</h1>

				{error && (
					<div className="p-2 text-sm text-red-600 bg-red-100 rounded">
						{error}
					</div>
				)}

				<select
					value={role}
					onChange={(e) => setRole(e.target.value as any)}
					className="w-full border rounded p-2"
				>
					<option value="user">User</option>
					<option value="doctor">Doctor</option>
				</select>

				<input
					type="email"
					placeholder="Email"
					className="w-full border rounded p-2"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<input
					type="password"
					placeholder="Password"
					className="w-full border rounded p-2"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Login
				</button>
			</form>
		</div>
	);
}
