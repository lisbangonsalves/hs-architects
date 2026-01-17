import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Contact from "../../../lib/models/Contact";

// GET - Fetch contact info
export async function GET() {
  try {
    await connectDB();
    
    // Get the first (and only) contact document, or create default
    let contact = await Contact.findOne();
    
    if (!contact) {
      // Create default contact info
      contact = await Contact.create({
        email: "studio@hsarchitects.com",
        phone: "+91 98765 43210",
        address: "Mumbai, India",
        note: "For project inquiries, collaborations, or general questions—reach out via email.",
      });
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}

// PUT - Update contact info
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Find and update, or create if doesn't exist
    let contact = await Contact.findOne();
    
    if (contact) {
      contact.email = data.email || contact.email;
      contact.phone = data.phone || contact.phone;
      contact.address = data.address || contact.address;
      contact.note = data.note !== undefined ? data.note : contact.note;
      await contact.save();
    } else {
      contact = await Contact.create(data);
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Failed to update contact info" },
      { status: 500 }
    );
  }
}
