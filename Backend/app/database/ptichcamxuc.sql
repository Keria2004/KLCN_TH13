CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'admin', 'student')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,

    teacher_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'ended')),

    created_at TIMESTAMPTZ DEFAULT now(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,

    duration_seconds INTEGER DEFAULT 0,
    total_frames INTEGER DEFAULT 0,
    dominant_emotion VARCHAR(50),
    positive_rate FLOAT DEFAULT 0,

    notes TEXT
);

CREATE INDEX idx_sessions_teacher_id ON sessions(teacher_id);
CREATE INDEX idx_sessions_status ON sessions(status);

CREATE TABLE emotion_readings (
    id BIGSERIAL PRIMARY KEY,

    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

    frame_number INTEGER NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    time_offset_seconds FLOAT,

    emotion VARCHAR(50) NOT NULL,
    confidence FLOAT,

    face_count INTEGER DEFAULT 0,

    image_path TEXT
);

CREATE INDEX idx_er_session_id ON emotion_readings(session_id);
CREATE INDEX idx_er_frame ON emotion_readings(session_id, frame_number);

CREATE TABLE session_reports (
    id BIGSERIAL PRIMARY KEY,

    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

    report_format VARCHAR(20) NOT NULL
        CHECK (report_format IN ('PDF', 'CSV', 'JSON', 'EXCEL')),

    file_path TEXT NOT NULL,
    file_size_bytes INTEGER,
    
    exported_by BIGINT REFERENCES users(id),
    exported_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_session_reports_session_id ON session_reports(session_id);
CREATE INDEX idx_session_reports_exported_at ON session_reports(exported_at DESC);
