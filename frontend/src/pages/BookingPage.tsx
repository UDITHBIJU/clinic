import { useState, useEffect } from "react";
import api from "../api/axios";

interface Doctor {
	_id: string;
	username: string;
	department: string;
	speciality: string;
}

interface Slot {
	_id: string;
	startTime: string;
	endTime: string;
}

export default function BookingPage() {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [slots, setSlots] = useState<Slot[]>([]);
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [patientName, setPatientName] = useState("");
	const [patientAge, setPatientAge] = useState<number | "">("");
	const [date, setDate] = useState("");
	const [slot, setSlot] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		api.get("/api/user/doctors").then((res) => setDoctors(res.data));
		api.get("/api/user/slots").then((res) => setSlots(res.data));
	}, []);

	const minDate = new Date();
	minDate.setDate(minDate.getDate() + 1);
	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 1);
	const formatDate = (d: Date) => d.toISOString().split("T")[0];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDoctor) return;

		try {
			await api.post("/api/user/appointments/book", {
				doctorId: selectedDoctor._id,
				patientName,
				patientAge,
				date,
				slotId: slot,
			});
			alert("Appointment booked!");
			setSelectedDoctor(null);
			setPatientName("");
			setPatientAge("");
			setDate("");
			setSlot("");
			setErrorMessage("");
		} catch (err: any) {
			if (err.response?.data?.message) {
				setErrorMessage(err.response.data.message);
			} else {
				setErrorMessage("Booking failed, please try again.");
			}
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Available Doctors</h1>

			<div className="space-y-4">
				{doctors.map((doc) => (
					<div
						key={doc._id}
						className="flex items-center justify-between border rounded-lg p-4 shadow hover:shadow-md transition"
					>
						<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full">
							<span className="font-semibold text-lg">{doc.username}</span>
							<span className="text-gray-600">{doc.speciality}</span>
							<span className="text-gray-500">{doc.department}</span>
						</div>
						<button
							className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							onClick={() => setSelectedDoctor(doc)}
						>
							Book
						</button>
					</div>
				))}
			</div>

			{/* Booking Form Modal */}
			{selectedDoctor && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">
							Book with Dr. {selectedDoctor.username}
						</h2>

						{errorMessage && (
							<p className="text-red-500 mb-3">{errorMessage}</p>
						)}

						<form className="space-y-4" onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Patient Name"
								className="border p-2 w-full rounded"
								value={patientName}
								onChange={(e) => setPatientName(e.target.value)}
								required
							/>
							<input
								type="number"
								placeholder="Patient Age"
								className="border p-2 w-full rounded"
								value={patientAge}
								onChange={(e) => setPatientAge(Number(e.target.value))}
								required
							/>
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
							<div className="flex justify-end gap-3">
								<button
									type="button"
									className="px-4 py-2 rounded bg-gray-300"
									onClick={() => {
										setSelectedDoctor(null);
										setErrorMessage("");
									}}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded bg-blue-500 text-white"
								>
									Book Appointment
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
