import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";

// Simple hash function (must match the one in users route)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // First check environment variables (fallback/super admin)
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json(
        { success: true, message: "Authentication successful", role: "admin" },
        { status: 200 }
      );
    }

    // Check database users
    await connectDB();
    const user = await User.findOne({ 
      username: username.toLowerCase(),
      isActive: true 
    });

    if (user && user.password === simpleHash(password)) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Authentication successful",
          role: user.role,
          name: user.name,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
