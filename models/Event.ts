import mongoose, { Schema } from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    photographer: { type: String },
    status: { type: String, default: "Pending" },
    duration: { type: String },
    price: { type: Number },
    clientName: { type: String },
    clientEmail: { type: String },
    contactNumber: { type: String },
    totalAmount: { type: Number },
    notes: { type: String },
    bookingSource: { type: String },
    googleMapsLink: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    createdFromBooking: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
