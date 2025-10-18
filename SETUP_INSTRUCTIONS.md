# Setup Instructions

## Prerequisites

1. Node.js 18+ installed
2. Supabase account and project
3. API keys for AI providers (optional for initial setup)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your Supabase project dashboard:
- Go to Project Settings → API
- Copy the Project URL and anon/public key

### 3. Database Setup - Apply AI Provider Migration

**IMPORTANT:** Apply the new migration for AI provider settings.

#### Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor**
4. Copy and paste the following SQL:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create practice rooms" ON practice_rooms;
DROP POLICY IF EXISTS "Users can update their own rooms" ON practice_rooms;
DROP POLICY IF EXISTS "Users can delete their own rooms" ON practice_rooms;

-- Create new permissive policies for anon/public access
CREATE POLICY "Anyone can create practice rooms"
  ON practice_rooms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update practice rooms"
  ON practice_rooms
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete practice rooms"
  ON practice_rooms
  FOR DELETE
  TO anon, authenticated
  USING (true);
```

5. Click **Run** to execute the migration

### Option 2: Using Migration File

The migration is already created at:
```
supabase/migrations/20251015140000_fix_practice_rooms_rls.sql
```

If you have the Supabase CLI installed, you can apply it with:
```bash
supabase db push
```

### Verify Migration

After applying the migration, you should be able to:
1. ✅ Create practice rooms successfully
2. ✅ See external share buttons for rooms with external participants
3. ✅ Copy/share invite links via Email and WhatsApp

### What This Migration Does

- **Removes** strict authentication requirements for demo mode
- **Allows** anonymous users to create, update, and delete practice rooms
- **Enables** the external invite sharing feature to work properly

This configuration is suitable for development and demo environments. For production, you should implement proper authentication and restrict these policies accordingly.
