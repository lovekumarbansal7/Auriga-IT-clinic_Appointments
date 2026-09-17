import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cleanId = id.trim();

    const { startTime } = await request.json();

    if (!startTime) {
      return Response.json(
        { message: "New start time is required" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(cleanId);

    if (!appointment) {
      return Response.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (appointment.status !== "BOOKED") {
      return Response.json(
        {
          message:
            "Only booked appointments can be rescheduled",
        },
        { status: 400 }
      );
    }

    const newStart = new Date(startTime);

    if (isNaN(newStart.getTime())) {
      return Response.json(
        { message: "Invalid date/time" },
        { status: 400 }
      );
    }

    // Appointment duration = 30 minutes
    const newEnd = new Date(
      newStart.getTime() + 30 * 60 * 1000
    );

    /*
      Check overlap with another BOOKED appointment
      of the SAME doctor.

      Important:
      Exclude the current appointment itself.
    */
    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctorId: appointment.doctorId,
      status: "BOOKED",
      startTime: { $lt: newEnd },
      endTime: { $gt: newStart },
    });

    if (conflict) {
      return Response.json(
        {
          message:
            "Doctor is already booked for the requested time slot",
        },
        { status: 409 }
      );
    }

    // Keep the same patient and doctor
    appointment.startTime = newStart;
    appointment.endTime = newEnd;

    await appointment.save();

    return Response.json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error("RESCHEDULE ERROR:", error);

    return Response.json(
      { message: "Failed to reschedule appointment" },
      { status: 500 }
    );
  }
}