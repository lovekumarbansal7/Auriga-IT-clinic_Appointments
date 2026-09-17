import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return Response.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    if (appointment.status === "CANCELLED") {
      return Response.json(
        { message: "Appointment is already cancelled" },
        { status: 400 }
      );
    }

    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);

    const hoursUntilAppointment =
      (appointmentTime - now) / (1000 * 60 * 60);

    let cancellationFee = 0;

    // Late cancellation = less than 2 hours before appointment
    if (hoursUntilAppointment < 2) {
      cancellationFee = 100;
    }

    appointment.status = "CANCELLED";
    appointment.cancellationFee = cancellationFee;

    await appointment.save();

    return Response.json({
      message: "Appointment cancelled successfully",
      cancellationFee,
      appointment,
    });
  } catch (error) {
    console.error("CANCELLATION ERROR:", error);

    return Response.json(
      { message: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}