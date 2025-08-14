import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</Router>
	);
}
