
-- SOAR CRM Core Tables Only
-- Essential tables for basic CRM functionality

-- Drop existing tables if they exist (in proper order to avoid foreign key constraints)
DROP TABLE IF EXISTS api_opportunity CASCADE;
DROP TABLE IF EXISTS api_lead CASCADE;
DROP TABLE IF EXISTS api_contact CASCADE;
DROP TABLE IF EXISTS api_company CASCADE;
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

-- Create Company table
CREATE TABLE api_company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_type VARCHAR(50) DEFAULT '',
    industry VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(254) DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    website VARCHAR(200) DEFAULT '',
    employee_count INTEGER,
    annual_revenue NUMERIC(15, 2),
    year_established INTEGER,
    size VARCHAR(20) NOT NULL,
    credit_rating VARCHAR(10) DEFAULT '',
    payment_terms VARCHAR(20) DEFAULT '',
    travel_budget NUMERIC(12, 2),
    annual_travel_volume VARCHAR(100) DEFAULT '',
    travel_frequency VARCHAR(20) DEFAULT '',
    preferred_class VARCHAR(20) DEFAULT '',
    sustainability_focus VARCHAR(20) DEFAULT '',
    risk_level VARCHAR(20) DEFAULT '',
    current_airlines TEXT DEFAULT '',
    expansion_plans VARCHAR(20) DEFAULT '',
    specialties TEXT DEFAULT '',
    technology_integration TEXT DEFAULT '',
    description TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Contact table
CREATE TABLE api_contact (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES api_company(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(20) DEFAULT '',
    position VARCHAR(100) NOT NULL,
    department VARCHAR(20) DEFAULT '',
    is_decision_maker BOOLEAN NOT NULL DEFAULT FALSE,
    linkedin_profile VARCHAR(200) DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Lead table
CREATE TABLE api_lead (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES api_company(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES api_contact(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    source VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    score INTEGER NOT NULL DEFAULT 0,
    estimated_value NUMERIC(12, 2),
    notes TEXT DEFAULT '',
    assigned_to_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    assigned_agent VARCHAR(255) DEFAULT '',
    next_action VARCHAR(255) DEFAULT '',
    next_action_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Opportunity table
CREATE TABLE api_opportunity (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL UNIQUE REFERENCES api_lead(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(20) NOT NULL DEFAULT 'discovery',
    probability INTEGER NOT NULL DEFAULT 0,
    estimated_close_date DATE NOT NULL,
    actual_close_date DATE,
    value NUMERIC(12, 2) NOT NULL,
    description TEXT DEFAULT '',
    next_steps TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_company_industry ON api_company(industry);
CREATE INDEX idx_company_size ON api_company(size);
CREATE INDEX idx_lead_status ON api_lead(status);
CREATE INDEX idx_lead_assigned_to ON api_lead(assigned_to_id);
CREATE INDEX idx_opportunity_stage ON api_opportunity(stage);
CREATE INDEX idx_opportunity_close_date ON api_opportunity(estimated_close_date);

-- Core tables setup complete
COMMIT;
