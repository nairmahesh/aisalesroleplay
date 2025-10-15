# Setup Instructions

## Database Migration Required

To enable room creation and external sharing features, you need to apply a database migration that updates the Row Level Security (RLS) policies.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: `kxhzkudsutyezstrqxbd`
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
