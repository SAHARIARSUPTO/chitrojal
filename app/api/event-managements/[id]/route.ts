import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";

const normalizeSchedule = (schedule: unknown, fallbackDate?: string | Date) => {
  if (Array.isArray(schedule) && schedule.length > 0) {
    return schedule
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const entry = item as { date?: string | Date; shift?: string };
        if (!entry.date) return null;
        return {
          date: new Date(entry.date),
          shift: entry.shift === "Night" ? "Night" : "Day",
        };
      })
      .filter(Boolean);
  }

  if (fallbackDate) {
    return [
      {
        date: new Date(fallbackDate),
        shift: "Day",
      },
    ];
  }

  return [];
};

const normalizeAmounts = (body: Record<string, unknown>) => {
  const totalAmount = Number(body.totalAmount || 0);
  const discountAmount = Number(body.discountAmount || 0);
  const advanceAmount = Number(body.advanceAmount || 0);
  const paidAmount = Number(body.paidAmount || advanceAmount || 0);
  const finalAmount = Math.max(totalAmount - discountAmount, 0);
  const dueAmount = Math.max(finalAmount - paidAmount, 0);

  return { totalAmount, discountAmount, advanceAmount, paidAmount, finalAmount, dueAmount };
};

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
    const amounts = normalizeAmounts(body);
    const eventSchedule = normalizeSchedule(body.eventSchedule, body.eventDate);
    const eventDate = eventSchedule[0]?.date || body.eventDate;
    const updatePayload = {
      ...body,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      eventSchedule,
      totalAmount: amounts.totalAmount,
      discountAmount: amounts.discountAmount,
      advanceAmount: amounts.advanceAmount,
      paidAmount: amounts.paidAmount,
      dueAmount: amounts.dueAmount,
      finalAmount: amounts.finalAmount,
    };

    const updatedOrder = await Order.findByIdAndUpdate(id, updatePayload, {
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
