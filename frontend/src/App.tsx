import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppointmentListPage from "./pages/AppointmentListPage";
import DashboardLayout from "./layouts/DashboardLayout";
import SignupPage from "./pages/SignUpPage";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route
					path="/booking"
					element={
						<ProtectedRoute allowedRole="user">
							<DashboardLayout>
								<BookingPage />
							</DashboardLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/appointments"
					element={
						<ProtectedRoute allowedRole="user">
							<DashboardLayout>
								<AppointmentListPage />
							</DashboardLayout>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}
