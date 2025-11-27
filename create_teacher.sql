-- Insert default teacher user if not exists
INSERT INTO users (id, full_name, email, password_hash, role)
VALUES 
  (1, 'Default Teacher', 'teacher@example.com', 'hashed_password', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT * FROM users;
