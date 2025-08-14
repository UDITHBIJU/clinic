import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage"; 
import ProtectedRoute from "./components/ProtectedRoute";

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
			</Routes>
		</Router>
	);
}
