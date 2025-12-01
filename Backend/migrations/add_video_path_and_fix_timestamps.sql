-- Migration: Add video_path and fix timestamp columns
-- Purpose: Support video persistence and proper timestamp defaults

-- Add video_path column if it doesn't exist
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS video_path TEXT;

-- Add started_at column if it doesn't exist (with server default)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Add notes column if it doesn't exist
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add dominant_emotion and positive_rate if they don't exist
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS dominant_emotion VARCHAR;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS positive_rate FLOAT DEFAULT 0.0;

-- Verify migration
SELECT 'Migration completed successfully' as status;
