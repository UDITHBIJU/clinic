import { useEffect, useState } from "react";
import api from "../api/axios";

interface Appointment {
	_id: string;
	doctor: {
		username: string;
	};
	patientName: string;
	patientAge: number;
	date: string;
	slot: {
		startTime: string;
		endTime: string;
	};
}

export default function AppointmentListPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.get("/api/user/appointments")
			.then((res) => {
				setAppointments(res.data.appointments);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <p className="text-center mt-10">Loading appointments...</p>;
	}

	if (!appointments.length) {
		return <p className="text-center mt-10">No appointments found</p>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-xl font-bold mb-4">My Appointments</h1>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse border">
					<thead>
						<tr className="bg-gray-100">
							<th className="border p-2">Doctor</th>
							<th className="border p-2">Patient Name</th>
							<th className="border p-2">Patient Age</th>
							<th className="border p-2">Date</th>
							<th className="border p-2">Slot</th>
						</tr>
					</thead>
					<tbody>
						{appointments.map((a) => (
							<tr key={a._id}>
								<td className="border p-2">{a.doctor.username || "N/A"}</td>
								<td className="border p-2">{a.patientName}</td>
								<td className="border p-2">{a.patientAge}</td>
								<td className="border p-2">
									{new Date(a.date).toLocaleDateString()}
								</td>
								<td className="border p-2">
									{a.slot ? `${a.slot.startTime} - ${a.slot.endTime}` : "N/A"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
