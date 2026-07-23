import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  photographer: { type: String },
  status: { type: String, default: "Pending" },
  duration: { type: String },
  price: { type: Number },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
