import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
	children: React.ReactElement;
	allowedRole?: string;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
	const token = localStorage.getItem("accessToken");
	if (!token) return <Navigate to="/login" replace />;

	try {
		const decoded = jwtDecode<{ role: string }>(token);
		if (allowedRole && decoded.role !== allowedRole) {
			return <Navigate to="/login" replace />;
		}
		return children;
	} catch {
		return <Navigate to="/login" replace />;
	}
}
 