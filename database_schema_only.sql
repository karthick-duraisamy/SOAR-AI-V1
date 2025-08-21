
-- SOAR CRM Database Schema Only
-- PostgreSQL Database Schema (Tables and Indexes Only)

-- Drop existing tables if they exist (in proper order to avoid foreign key constraints)
DROP TABLE IF EXISTS api_aiconversation CASCADE;
DROP TABLE IF EXISTS api_activitylog CASCADE;
DROP TABLE IF EXISTS api_leadhistory CASCADE;
DROP TABLE IF EXISTS api_leadnote CASCADE;
DROP TABLE IF EXISTS api_revenueforecast CASCADE;
DROP TABLE IF EXISTS api_supportticket CASCADE;
DROP TABLE IF EXISTS api_traveloffer_target_companies CASCADE;
DROP TABLE IF EXISTS api_traveloffer CASCADE;
DROP TABLE IF EXISTS api_emailcampaign_target_leads CASCADE;
DROP TABLE IF EXISTS api_emailcampaign CASCADE;
DROP TABLE IF EXISTS api_contractbreach CASCADE;
DROP TABLE IF EXISTS api_contract CASCADE;
DROP TABLE IF EXISTS api_opportunityactivity CASCADE;
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

-- Create OpportunityActivity table
CREATE TABLE api_opportunityactivity (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER NOT NULL REFERENCES api_opportunity(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL
);

-- Create Contract table
CREATE TABLE api_contract (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER REFERENCES api_opportunity(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES api_company(id) ON DELETE CASCADE,
    contract_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    contract_type VARCHAR(30) NOT NULL DEFAULT 'corporate_travel',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    value NUMERIC(12, 2) NOT NULL,
    terms TEXT NOT NULL,
    renewal_terms TEXT DEFAULT '',
    auto_renewal BOOLEAN NOT NULL DEFAULT FALSE,
    notice_period_days INTEGER NOT NULL DEFAULT 30,
    risk_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create ContractBreach table
CREATE TABLE api_contractbreach (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES api_contract(id) ON DELETE CASCADE,
    breach_type VARCHAR(20) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    detected_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_date TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    financial_impact NUMERIC(10, 2),
    resolution_notes TEXT DEFAULT ''
);

-- Create EmailCampaign table
CREATE TABLE api_emailcampaign (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    campaign_type VARCHAR(20) NOT NULL DEFAULT 'nurture',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    subject_line VARCHAR(255) NOT NULL,
    email_content TEXT NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    sent_date TIMESTAMP WITH TIME ZONE,
    emails_sent INTEGER NOT NULL DEFAULT 0,
    emails_opened INTEGER NOT NULL DEFAULT 0,
    emails_clicked INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create EmailCampaign target leads junction table
CREATE TABLE api_emailcampaign_target_leads (
    id SERIAL PRIMARY KEY,
    emailcampaign_id INTEGER NOT NULL REFERENCES api_emailcampaign(id) ON DELETE CASCADE,
    lead_id INTEGER NOT NULL REFERENCES api_lead(id) ON DELETE CASCADE,
    UNIQUE(emailcampaign_id, lead_id)
);

-- Create TravelOffer table
CREATE TABLE api_traveloffer (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    offer_type VARCHAR(20) NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'draft',
    discount_percentage NUMERIC(5, 2),
    base_price NUMERIC(10, 2) NOT NULL,
    discounted_price NUMERIC(10, 2),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    terms_conditions TEXT NOT NULL,
    bookings_count INTEGER NOT NULL DEFAULT 0,
    revenue_generated NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_by_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create TravelOffer target companies junction table
CREATE TABLE api_traveloffer_target_companies (
    id SERIAL PRIMARY KEY,
    traveloffer_id INTEGER NOT NULL REFERENCES api_traveloffer(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES api_company(id) ON DELETE CASCADE,
    UNIQUE(traveloffer_id, company_id)
);

-- Create SupportTicket table
CREATE TABLE api_supportticket (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    company_id INTEGER NOT NULL REFERENCES api_company(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES api_contact(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(15) NOT NULL DEFAULT 'general',
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    status VARCHAR(15) NOT NULL DEFAULT 'open',
    assigned_to_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    resolution_notes TEXT DEFAULT '',
    satisfaction_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create RevenueForecast table
CREATE TABLE api_revenueforecast (
    id SERIAL PRIMARY KEY,
    period_type VARCHAR(15) NOT NULL DEFAULT 'monthly',
    period VARCHAR(20) NOT NULL,
    forecasted_revenue NUMERIC(15, 2) NOT NULL,
    actual_revenue NUMERIC(15, 2),
    confidence_level INTEGER NOT NULL DEFAULT 80,
    factors JSONB NOT NULL DEFAULT '{}',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create LeadNote table
CREATE TABLE api_leadnote (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES api_lead(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    next_action VARCHAR(255) DEFAULT '',
    urgency VARCHAR(10) NOT NULL DEFAULT 'Medium',
    created_by_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create LeadHistory table
CREATE TABLE api_leadhistory (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES api_lead(id) ON DELETE CASCADE,
    history_type VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    icon VARCHAR(20) NOT NULL DEFAULT 'plus',
    user_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create ActivityLog table
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

-- Create AIConversation table
CREATE TABLE api_aiconversation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    session_id UUID NOT NULL DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB NOT NULL DEFAULT '{}',
    entities_mentioned JSONB NOT NULL DEFAULT '[]',
    actions_suggested JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_company_industry ON api_company(industry);
CREATE INDEX idx_company_size ON api_company(size);
CREATE INDEX idx_lead_status ON api_lead(status);
CREATE INDEX idx_lead_assigned_to ON api_lead(assigned_to_id);
CREATE INDEX idx_opportunity_stage ON api_opportunity(stage);
CREATE INDEX idx_opportunity_close_date ON api_opportunity(estimated_close_date);
CREATE INDEX idx_leadhistory_lead_timestamp ON api_leadhistory(lead_id, timestamp);
CREATE INDEX idx_activitylog_timestamp ON api_activitylog(timestamp);
CREATE INDEX idx_supportticket_status ON api_supportticket(status);
CREATE INDEX idx_unique_session_id ON api_aiconversation(session_id);

-- Schema setup complete
COMMIT;
