import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED",
    },

    cancellationFee: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking
appointmentSchema.index(
  {
    doctorId: 1,
    startTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "BOOKED",
    },
  }
);

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);