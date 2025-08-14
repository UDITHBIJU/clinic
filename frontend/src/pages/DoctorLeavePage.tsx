import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Slot {
	_id: string;
	startTime: string;
	endTime: string;
}

export default function DoctorLeavePage() {
	const [slots, setSlots] = useState<Slot[]>([]);
	const [date, setDate] = useState("");
	const [slot, setSlot] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

	useEffect(() => {
		api
			.get("/api/user/slots")
			.then((res) => setSlots(res.data))
			.catch(() => setErrorMessage("Failed to load slots"));
	}, []);

	const minDate = new Date();
	minDate.setDate(minDate.getDate() + 1);
	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 1);
	const formatDate = (d: Date) => d.toISOString().split("T")[0];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post("/api/doctor/leave", {
				date,
				slotId: slot,
			});
			setSuccessMessage("Leave marked successfully!");
			setDate("");
			setSlot("");
			setErrorMessage("");
		} catch (err: any) {
			if (err.response?.data?.message) {
				setErrorMessage(err.response.data.message);
			} else {
				setErrorMessage("Failed to mark leave, please try again.");
			}
			setSuccessMessage("");
		}
	};
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
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-6">Mark Leave</h1>

			{errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
			{successMessage && (
				<p className="text-green-500 mb-3">{successMessage}</p>
			)}

			<form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
				<input
					type="date"
					className="border p-2 w-full rounded"
					min={formatDate(minDate)}
					max={formatDate(maxDate)}
					value={date}
					onChange={(e) => setDate(e.target.value)}
					required
				/>

				<select
					value={slot}
					onChange={(e) => setSlot(e.target.value)}
					className="border p-2 w-full rounded"
					required
				>
					<option value="">Select Slot</option>
					{slots.map((s) => (
						<option key={s._id} value={s._id}>
							{`${s.startTime} - ${s.endTime}`}
						</option>
					))}
				</select>

				<button
					type="submit"
					className="px-4 py-2 rounded bg-blue-500 text-white"
				>
					Mark Leave
				</button>
			</form>
			<button
				onClick={handleLogout}
				className="bg-red-600 mt-10 w-fit p-3 rounded-xl hover:bg-red-700"
			>
				Logout
			</button>
		</div>
	);
}
