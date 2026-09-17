import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate("appointmentId");

    return Response.json(notifications);
  } catch (error) {
    console.error("OUTBOX ERROR:", error);

    return Response.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}