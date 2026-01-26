import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Settings from "../../../lib/models/Settings";

// GET - Fetch settings (optionally by key)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await Settings.findOne({ key });
      if (!setting) {
        // Return default values for known keys
        const defaults = {
          projectsLayout: "list", // "list" (current UI) or "grid" (second UI)
        };
        return NextResponse.json({ key, value: defaults[key] || null });
      }
      return NextResponse.json(setting);
    }

    // Return all settings
    const settings = await Settings.find();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update or create a setting
export async function PUT(request) {
  try {
    await connectDB();
    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "Setting key is required" },
        { status: 400 }
      );
    }

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
