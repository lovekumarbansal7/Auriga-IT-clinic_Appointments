import connectDB from "@/lib/db";
import Doctor from "@/models/Doctor";

export async function GET() {
  try {
    await connectDB();

    const doctors = await Doctor.find().sort({ name: 1 });

    return Response.json(doctors);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const { name, specialization } = await request.json();

    if (!name || !specialization) {
      return Response.json(
        { message: "Name and specialization are required" },
        { status: 400 }
      );
    }

    const doctor = await Doctor.create({
      name,
      specialization,
    });

    return Response.json(
      {
        message: "Doctor created successfully",
        doctor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create doctor" },
      { status: 500 }
    );
  }
}