import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../../lib/models/User";

// Simple hash function (for basic security - in production use bcrypt)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// GET - Fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.username || !data.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: data.username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = simpleHash(data.password);

    const user = await User.create({
      username: data.username.toLowerCase(),
      password: hashedPassword,
      name: data.name || "",
      role: data.role || "editor",
      isActive: true,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData = {
      name: data.name,
      role: data.role,
      isActive: data.isActive,
    };

    // If password is provided, hash it
    if (data.password) {
      updateData.password = simpleHash(data.password);
    }

    const user = await User.findByIdAndUpdate(
      data.id,
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
