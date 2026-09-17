import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";

export async function POST(request) {
  try {
    await connectDB();

    const { patientName, doctorId, startTime } = await request.json();

    if (!patientName || !doctorId || !startTime) {
      return Response.json(
        { message: "Patient, doctor and time are required" },
        { status: 400 }
      );
    }

    // Check doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return Response.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    const start = new Date(startTime);

    if (isNaN(start.getTime())) {
      return Response.json(
        { message: "Invalid appointment time" },
        { status: 400 }
      );
    }

    // Appointment duration = 30 minutes
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    // Check if doctor is already booked
    const existing = await Appointment.findOne({
      doctorId,
      startTime: start,
      status: "BOOKED",
    });

    if (existing) {
      return Response.json(
        {
          message: "Doctor is already booked for this time slot",
        },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      patientName,
      doctorId,
      startTime: start,
      endTime: end,
      status: "BOOKED",
    });

    return Response.json(
      {
        message: "Appointment booked successfully",
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    // Handles simultaneous booking attempts
    if (error.code === 11000) {
      return Response.json(
        {
          message: "Doctor is already booked for this time slot",
        },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const sort = searchParams.get("sort") || "startTime";
    const order = searchParams.get("order") === "desc" ? -1 : 1;

    const query = search
      ? {
          patientName: {
            $regex: search,
            $options: "i",
          },
        }
      : {};

    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name specialization")
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}