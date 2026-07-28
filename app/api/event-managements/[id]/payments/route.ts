import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Payment from "@/models/Payment";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await mongooseConnect();

  try {
    const { id } = await params;
    const body = await req.json();
    const { amount, method } = body;

    if (!amount || !method) {
      return NextResponse.json(
        { message: "Amount and method are required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const newPayment = new Payment({
      amount: Number(amount),
      method,
      order: id,
    });

    await newPayment.save();

    order.payments.push(newPayment._id);
    order.paidAmount += newPayment.amount;
    order.dueAmount = order.totalAmount - order.paidAmount;

    await order.save();

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json(
      { message: "Error adding payment", error },
      { status: 500 }
    );
  }
}
