// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Payment from "@/models/Payment";

type RouteContext = {
  params: Promise<{ id?: string }> | { id?: string };
};

const getOrderId = async (context: RouteContext) => {
  const params = await context.params;
  const id = params?.id;

  if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return null;
  }

  return id;
};

// GET a single order
export async function GET(request: Request, context: RouteContext) {
  await mongooseConnect();
  try {
    const id = await getOrderId(context);
    if (!id) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const order = await Order.findById(id).populate("payments");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 },
    );
  }
}

// DELETE an order
export async function DELETE(request: Request, context: RouteContext) {
  await mongooseConnect();
  try {
    const id = await getOrderId(context);
    if (!id) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await Payment.deleteMany({ order: id });
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Error deleting order" },
      { status: 500 },
    );
  }
}

// UPDATE an order (including adding payments)
export async function PUT(request: Request, context: RouteContext) {
  await mongooseConnect();
  try {
    const id = await getOrderId(context);
    if (!id) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const body = await request.json();

    if (body.newPayment) {
      const { amount, method } = body.newPayment;

      const order = await Order.findById(id);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const payment = new Payment({
        amount,
        method,
        order: id,
      });
      await payment.save();

      order.payments.push(payment._id);
      order.paidAmount += amount;
      order.dueAmount = order.totalAmount - order.paidAmount;

      const updatedOrder = await order.save();
      return NextResponse.json(updatedOrder);
    } else {
      const updatedOrder = await Order.findByIdAndUpdate(id, body, {
        new: true,
      });
      if (!updatedOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (body.totalAmount !== undefined) {
        updatedOrder.dueAmount =
          updatedOrder.totalAmount - updatedOrder.paidAmount;
        await updatedOrder.save();
      }
      return NextResponse.json(updatedOrder);
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 },
    );
  }
}
