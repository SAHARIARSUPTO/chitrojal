import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Payment from "@/models/Payment";

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { orderId, amount, method, notes } = await request.json();

    if (!orderId || !amount || !method) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const newPayment = new Payment({
      amount: Number(amount),
      method,
      notes,
      order: orderId,
    });

    await newPayment.save();

    order.payments.push(newPayment._id);
    order.paidAmount = Number(order.paidAmount || 0) + newPayment.amount;
    const discountAmount = Number(order.discountAmount || 0);
    order.finalAmount = Math.max(Number(order.totalAmount || 0) - discountAmount, 0);
    order.dueAmount = Math.max(order.finalAmount - order.paidAmount, 0);

    await order.save();

    return NextResponse.json({ message: "Payment added successfully", order });
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json(
      { message: "Error adding payment", error },
      { status: 500 },
    );
  }
}
