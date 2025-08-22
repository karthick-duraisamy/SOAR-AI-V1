
-- SOAR CRM Users and Security Tables
-- User management and authentication tables

-- Drop existing tables if they exist
DROP TABLE IF EXISTS api_activitylog CASCADE;
DROP TABLE IF EXISTS auth_user CASCADE;

-- Create auth_user table (Django compatible structure)
CREATE TABLE auth_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL DEFAULT '',
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create ActivityLog table for audit trail
CREATE TABLE api_activitylog (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    action_type VARCHAR(20) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_activitylog_timestamp ON api_activitylog(timestamp);
CREATE INDEX idx_activitylog_user ON api_activitylog(user_id);
CREATE INDEX idx_activitylog_entity ON api_activitylog(entity_type, entity_id);

-- Sample admin user (password: admin123)
INSERT INTO auth_user (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) VALUES
('pbkdf2_sha256$600000$dummy123456789$abc123def456', NOW(), TRUE, 'admin', 'Admin', 'User', 'admin@soar.com', TRUE, TRUE, NOW());

-- Reset sequence
SELECT setval('auth_user_id_seq', COALESCE((SELECT MAX(id) FROM auth_user), 1));
SELECT setval('api_activitylog_id_seq', COALESCE((SELECT MAX(id) FROM api_activitylog), 1));

-- Users and security setup complete
COMMIT;
