import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Ensure you have MONGODB_URI in your .env.local file
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();

    // Basic validation
    if (
      !bookingData.name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.eventDate
    ) {
      return NextResponse.json(
        { message: "Required fields are missing." },
        { status: 400 },
      );
    }

    await client.connect();
    const database = client.db("chitrojalDB"); // Replace with your database name
    const bookings = database.collection("bookings");

    const newBooking = {
      ...bookingData,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await bookings.insertOne(newBooking);

    return NextResponse.json(
      {
        message: "Booking request received successfully!",
        bookingId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
