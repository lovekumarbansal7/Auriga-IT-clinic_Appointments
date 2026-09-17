import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import Notification from "@/models/Notification";

export async function POST(request) {
  try {
    await connectDB();

    // Allow the grader/Postman to provide a custom time
    const body = await request.json().catch(() => ({}));

    const now = body.now ? new Date(body.now) : new Date();

    if (isNaN(now.getTime())) {
      return Response.json(
        { message: "Invalid clock time" },
        { status: 400 }
      );
    }

    /*
     * Find today's appointments.
     *
     * Example:
     * If now = 2026-09-20,
     * find appointments between:
     *
     * 2026-09-20 00:00
     * and
     * 2026-09-21 00:00
     */

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todaysAppointments = await Appointment.find({
      status: "BOOKED",
      startTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    let remindersCreated = 0;

    for (const appointment of todaysAppointments) {
      /*
       * Check whether a reminder already exists.
       * This prevents duplicate notifications if /clock
       * is called multiple times.
       */

      const existingNotification =
        await Notification.findOne({
          appointmentId: appointment._id,
          type: "APPOINTMENT_REMINDER",
        });

      if (existingNotification) {
        continue;
      }

      const appointmentTime =
        new Date(appointment.startTime).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      await Notification.create({
        appointmentId: appointment._id,
        patientName: appointment.patientName,
        type: "APPOINTMENT_REMINDER",
        message: `Reminder: You have a clinic appointment today at ${appointmentTime}.`,
      });

      remindersCreated++;
    }

    return Response.json({
      message: "Clock processed successfully",
      now,
      remindersCreated,
    });
  } catch (error) {
    console.error("CLOCK ERROR:", error);

    return Response.json(
      { message: "Clock processing failed" },
      { status: 500 }
    );
  }
}