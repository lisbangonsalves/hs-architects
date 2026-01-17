# MongoDB Setup Instructions

This project has been migrated from JSON files to MongoDB for Vercel deployment compatibility.

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database. You can use:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
   - Local MongoDB instance
   - Any MongoDB-compatible database

2. **MongoDB Connection String**: Get your connection string (URI) from your MongoDB provider.
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`
   - Or: `mongodb://localhost:27017/database-name` (for local)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variable

Create or update `.env.local` in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

**Important**: Make sure to add `.env.local` to `.gitignore` to keep your credentials safe.

### 3. Migrate Existing Data (Optional)

If you have existing data in the `data/` folder JSON files, you can migrate it to MongoDB:

```bash
# Set the MongoDB URI and run the migration script
MONGODB_URI=your_mongodb_connection_string node scripts/migrate-to-mongodb.mjs
```

Or if you have MONGODB_URI set in your `.env.local` file, you can load it:

```bash
# On macOS/Linux
export $(cat .env.local | xargs) && node scripts/migrate-to-mongodb.mjs
```

This script will:
- Read data from `data/categories.json`, `data/projects.json`, and `data/homeGrid.json`
- Create corresponding documents in MongoDB
- Skip duplicates if they already exist

### 4. For Vercel Deployment

1. Add the `MONGODB_URI` environment variable in your Vercel project settings:
   - Go to your project → Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string
   - Make sure to set it for all environments (Production, Preview, Development)

2. Deploy your project - MongoDB will work seamlessly!

## Database Structure

### Collections

1. **categories**: Stores project categories (Architecture, Interior Design, etc.)
2. **projects**: Stores individual projects with their details and images
3. **homegrids**: Stores the 9 images for the home page grid

### Models

- **Category**: `name`, `slug`, `description`, `image`
- **Project**: `name`, `categoryId`, `label`, `location`, `year`, `image`, `href`, `title`, `description`, `images[]`
- **HomeGrid**: `position` (1-9), `image`, `cloudinaryPublicId`

## API Routes

All API routes have been updated to use MongoDB:

- `GET /api/categories` - Fetch all categories
- `POST /api/categories` - Create a category
- `PUT /api/categories` - Update a category
- `DELETE /api/categories` - Delete a category

- `GET /api/projects?categoryId=xxx` - Fetch projects (optionally filtered by category)
- `POST /api/projects` - Create a project
- `PUT /api/projects` - Update a project
- `DELETE /api/projects?id=xxx` - Delete a project

- `GET /api/home-grid` - Fetch all home grid images
- `PUT /api/home-grid` - Update a specific grid image
- `POST /api/home-grid` - Reorder all 9 grid images

## Notes

- The connection is cached globally to prevent multiple connections during development
- All timestamps are automatically managed by Mongoose
- The `_id` field from MongoDB is converted to `id` (string) in API responses for frontend compatibility
