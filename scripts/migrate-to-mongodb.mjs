/**
 * Migration script to migrate data from JSON files to MongoDB
 * Run this once after setting up MongoDB to migrate existing data
 * 
 * Usage: node scripts/migrate-to-mongodb.mjs
 * 
 * Make sure MONGODB_URI is set in your environment or .env.local file
 * You can also run: MONGODB_URI=your_uri node scripts/migrate-to-mongodb.mjs
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models - need to use dynamic import or recreate schemas
// For simplicity, we'll recreate the schemas here
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    label: { type: String, required: true },
    location: { type: String, default: "" },
    year: { type: String, default: "" },
    image: { type: String, default: "" },
    href: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const HomeGridSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true, min: 1, max: 9 },
    image: { type: String, default: "" },
    cloudinaryPublicId: { type: String, default: null },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const HomeGrid = mongoose.models.HomeGrid || mongoose.model("HomeGrid", HomeGridSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Please set MONGODB_URI in your environment or .env.local file");
  console.error("   Example: MONGODB_URI=your_uri node scripts/migrate-to-mongodb.mjs");
  process.exit(1);
}

async function migrate() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Migrate Categories
    console.log("📁 Migrating categories...");
    const categoriesPath = join(__dirname, "../data/categories.json");
    const categoriesData = JSON.parse(readFileSync(categoriesPath, "utf8"));
    
    for (const cat of categoriesData) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image || "",
        });
        console.log(`  ✓ Created category: ${cat.name}`);
      } else {
        console.log(`  - Category already exists: ${cat.name}`);
      }
    }

    // Migrate Projects
    console.log("\n📁 Migrating projects...");
    const projectsPath = join(__dirname, "../data/projects.json");
    const projectsData = JSON.parse(readFileSync(projectsPath, "utf8"));
    
    for (const proj of projectsData) {
      const existing = await Project.findOne({ name: proj.name, categoryId: proj.categoryId });
      if (!existing) {
        await Project.create({
          name: proj.name,
          categoryId: proj.categoryId,
          label: proj.label,
          location: proj.location || "",
          year: proj.year || "",
          image: proj.image || "",
          href: proj.href || "",
          title: proj.name,
          description: "",
          images: [],
        });
        console.log(`  ✓ Created project: ${proj.name}`);
      } else {
        console.log(`  - Project already exists: ${proj.name}`);
      }
    }

    // Migrate HomeGrid
    console.log("\n📁 Migrating home grid...");
    const homeGridPath = join(__dirname, "../data/homeGrid.json");
    const homeGridData = JSON.parse(readFileSync(homeGridPath, "utf8"));
    
    // Clear existing home grid items
    await HomeGrid.deleteMany({});
    
    for (const item of homeGridData) {
      await HomeGrid.create({
        position: item.position,
        image: item.image || "",
        cloudinaryPublicId: item.cloudinaryPublicId || null,
      });
      console.log(`  ✓ Created home grid item at position ${item.position}`);
    }

    console.log("\n✅ Migration completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrate();
