import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Message from "../../../lib/models/Message";

// GET - Fetch all messages
export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Create new message
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.email || !data.message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      email: data.email,
      phone: data.phone || "",
      message: data.message,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    await Message.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}

// PUT - Mark message as read
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const message = await Message.findByIdAndUpdate(
      data.id,
      { read: true },
      { new: true }
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
