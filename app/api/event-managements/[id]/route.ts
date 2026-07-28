import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await mongooseConnect();
  const { id } = await params;
  try {
    const order = await Order.findById(id).populate("payments");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching order", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await mongooseConnect();
  const { id } = await params;
  const body = await request.json();
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating order", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await mongooseConnect();
  const { id } = await params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting order", error },
      { status: 500 }
    );
  }
}
