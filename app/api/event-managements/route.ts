import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET() {
  await mongooseConnect();
  const orders = await Order.find().sort({ eventDate: -1 });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await mongooseConnect();
  const body = await request.json();
  const order = await Order.create(body);
  return NextResponse.json(order);
}
