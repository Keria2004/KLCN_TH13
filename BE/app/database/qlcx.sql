-- CREATE TABLES
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'admin', 'principal'))
);

CREATE TABLE classes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    teacher_id BIGINT REFERENCES users(id)
);

CREATE TABLE sessions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    class_id BIGINT REFERENCES classes(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ
);

CREATE TABLE emotion_types (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE emotion_records (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id BIGINT REFERENCES sessions(id),
    face_id TEXT NOT NULL,
    emotion_id BIGINT REFERENCES emotion_types(id),
    confidence REAL NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE class_emotion_snapshots (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id BIGINT REFERENCES sessions(id),
    timestamp TIMESTAMPTZ NOT NULL,
    emotion_summary JSONB NOT NULL
);

CREATE TABLE session_alerts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id BIGINT REFERENCES sessions(id),
    timestamp TIMESTAMPTZ NOT NULL,
    alert_type TEXT NOT NULL
);

CREATE TABLE reports (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    session_id BIGINT REFERENCES sessions(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    report_data JSONB NOT NULL
);

-- CREATE INDEX
CREATE INDEX idx_emotion_records_timestamp ON emotion_records (timestamp);
CREATE INDEX idx_class_emotion_snapshots_timestamp ON class_emotion_snapshots (timestamp);

-- TRIGGER FUNCTION
-- Trigger cảnh báo khi tỷ lệ chán nản trên 40%
CREATE OR REPLACE FUNCTION check_boredom_alert() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM emotion_records WHERE emotion_id = (SELECT id FROM emotion_types WHERE name = 'bored') AND timestamp > NOW() - INTERVAL '5 minutes') > 0.4 * (SELECT COUNT(*) FROM emotion_records WHERE timestamp > NOW() - INTERVAL '5 minutes') THEN
        INSERT INTO session_alerts (session_id, timestamp, alert_type) VALUES (NEW.session_id, NOW(), 'boredom');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_boredom_alert
AFTER INSERT ON emotion_records
FOR EACH ROW EXECUTE FUNCTION check_boredom_alert();


-- INSERT DATA
INSERT INTO users (name, role) VALUES
('Phạm Văn Tisen', 'teacher'),
('Lâm Đức Thịnh', 'principal'),
('Võ Huỳnh Sơn', 'admin');


INSERT INTO classes (name, teacher_id) VALUES
('Lớp 12A1', 1),
('Lớp 12A2', 1);


INSERT INTO sessions (class_id, start_time, end_time) VALUES
(1, NOW() - INTERVAL '1 hour', NOW()),
(1, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours');


INSERT INTO emotion_types (name) VALUES
('Anger'),
('Disgust'),
('Fear'),
('Happy'),
('Neutral'),
('Sad'),
('Surprise');




