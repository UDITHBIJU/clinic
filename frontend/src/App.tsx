import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage"; 
import ProtectedRoute from "./components/ProtectedRoute";
import AppointmentListPage from "./pages/AppointmentListPage";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/booking"
					element={
						<ProtectedRoute allowedRole="user">
							<BookingPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/appointments"
					element={
						<ProtectedRoute allowedRole="user">
              <AppointmentListPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}
