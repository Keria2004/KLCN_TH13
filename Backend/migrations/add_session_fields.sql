-- Migration: Add session end support fields
-- Purpose: Support ending sessions and saving data to database

-- Alter sessions table to add new columns
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS total_frames INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS emotion_summary TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON sessions(ended_at);

-- Verify migration
SELECT 'Migration completed successfully' as status;
