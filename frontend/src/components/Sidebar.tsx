import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom"; 

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/booking", label: "Book Appointment" },
    { path: "/appointments", label: "My Appointments" },
  ];
  const handleLogout = async () => {
		try {
			await api.post("/api/auth/logout");
			localStorage.removeItem("accessToken");
			localStorage.removeItem("role"); 
			navigate("/login");
		} catch (err) {
			console.error("Logout failed", err);
		}
	};


  return (
		<>
			{/* Mobile Header */}
			<div className="fixed top-2 left-1 z-10 bg-blue-600 text-white p-1 rounded shadow-lg hover:bg-gray-700 ">
				<button onClick={() => setOpen(!open)} aria-label="Toggle Sidebar">
					{open ? <X size={24} /> : <Menu size={20} />}
				</button>
			</div>

			{/* Sidebar */}
			<div
				className={`bg-gray-600 text-white w-64 p-4 flex flex-col fixed md:static min-h-screen z-20 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
			>
				<h2 className="text-2xl font-bold mb-6 md:block">HealthCare</h2>
				<nav className="flex flex-col gap-2 flex-grow">
					{navLinks.map((link) => (
						<Link
							key={link.path}
							to={link.path}
							onClick={() => setOpen(false)}
							className={`p-2 rounded hover:bg-gray-500 ${
								location.pathname === link.path ? "bg-gray-500" : ""
							}`}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<button
					onClick={handleLogout}
					className="bg-red-600 mt-10 w-full p-2 rounded hover:bg-red-700"
				>
					Logout
				</button>
			</div>

			{open && (
				<div
					onClick={() => setOpen(false)}
					className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
				/>
			)}
		</>
	);
}