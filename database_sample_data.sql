
-- SOAR CRM Sample Data
-- PostgreSQL Sample Data Insert Statements

-- NOTE: Run database_schema_only.sql first before running this file

BEGIN;

-- Users (with properly hashed passwords for Django)
INSERT INTO auth_user (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) VALUES
('pbkdf2_sha256$600000$dummy123456789$abc123def456', NOW(), TRUE, 'admin', 'Admin', 'User', 'admin@soar.com', TRUE, TRUE, NOW()),
('pbkdf2_sha256$600000$dummy123456789$def456ghi789', NOW(), FALSE, 'john_doe', 'John', 'Doe', 'john@soar.com', TRUE, TRUE, NOW()),
('pbkdf2_sha256$600000$dummy123456789$ghi789jkl012', NOW(), FALSE, 'jane_smith', 'Jane', 'Smith', 'jane@soar.com', TRUE, TRUE, NOW()),
('pbkdf2_sha256$600000$dummy123456789$jkl012mno345', NOW(), FALSE, 'mike_wilson', 'Mike', 'Wilson', 'mike@soar.com', TRUE, TRUE, NOW());

-- Companies
INSERT INTO api_company (name, company_type, industry, location, email, phone, website, employee_count, annual_revenue, year_established, size, credit_rating, payment_terms, travel_budget, annual_travel_volume, travel_frequency, preferred_class, sustainability_focus, risk_level, current_airlines, expansion_plans, specialties, technology_integration, description, is_active) VALUES
('TechCorp Solutions', 'corporation', 'technology', 'San Francisco, CA', 'contact@techcorp.com', '+1-555-0101', 'https://techcorp.com', 500, 50000000.00, 2010, 'large', 'AAA', 'Net 30', 2500000.00, '500+ trips/year', 'Weekly', 'Business', 'High', 'Low', 'United, Delta, American', 'Aggressive', 'Software Development, Cloud Services', 'AI, Machine Learning', 'Leading technology solutions provider', TRUE),
('Global Finance Ltd', 'corporation', 'finance', 'New York, NY', 'info@globalfinance.com', '+1-555-0102', 'https://globalfinance.com', 2000, 200000000.00, 1995, 'enterprise', 'AA', 'Net 15', 5000000.00, '1000+ trips/year', 'Daily', 'First', 'Very High', 'Very Low', 'Delta, United, Lufthansa', 'Conservative', 'Investment Banking, Wealth Management', 'Blockchain, Fintech', 'International financial services company', TRUE),
('HealthTech Innovations', 'llc', 'healthcare', 'Boston, MA', 'contact@healthtech.com', '+1-555-0103', 'https://healthtech.com', 200, 25000000.00, 2015, 'medium', 'A', 'Net 45', 800000.00, '200+ trips/year', 'Monthly', 'Business', 'Medium', 'Medium', 'JetBlue, American', 'Moderate', 'Medical Devices, Telemedicine', 'IoT, Data Analytics', 'Healthcare technology innovator', TRUE),
('Manufacturing Corp', 'corporation', 'manufacturing', 'Detroit, MI', 'sales@manufacturingcorp.com', '+1-555-0104', 'https://manufacturingcorp.com', 1500, 100000000.00, 1985, 'large', 'BBB', 'Net 60', 1200000.00, '300+ trips/year', 'Bi-weekly', 'Economy Plus', 'Low', 'High', 'Southwest, American', 'Stable', 'Automotive Parts, Industrial Equipment', 'Automation, Robotics', 'Leading manufacturing solutions provider', TRUE),
('EduTech Partners', 'partnership', 'education', 'Austin, TX', 'hello@edutech.com', '+1-555-0105', 'https://edutech.com', 150, 15000000.00, 2018, 'small', 'A', 'Net 30', 300000.00, '100+ trips/year', 'Quarterly', 'Economy', 'High', 'Low', 'Southwest, United', 'Rapid', 'E-Learning, Educational Software', 'VR/AR, Gamification', 'Educational technology solutions', TRUE);

-- Contacts
INSERT INTO api_contact (company_id, first_name, last_name, email, phone, position, department, is_decision_maker, linkedin_profile, notes) VALUES
(1, 'John', 'Smith', 'j.smith@techcorp.com', '+1-555-1001', 'CEO', 'executive', TRUE, 'https://linkedin.com/in/johnsmith', 'Primary decision maker for travel policies'),
(1, 'Sarah', 'Johnson', 's.johnson@techcorp.com', '+1-555-1002', 'VP of Operations', 'operations', TRUE, 'https://linkedin.com/in/sarahjohnson', 'Handles operational travel requirements'),
(1, 'Mike', 'Davis', 'm.davis@techcorp.com', '+1-555-1003', 'Travel Manager', 'travel', FALSE, 'https://linkedin.com/in/mikedavis', 'Day-to-day travel coordination'),
(2, 'Jennifer', 'White', 'j.white@globalfinance.com', '+1-555-2001', 'CFO', 'finance', TRUE, 'https://linkedin.com/in/jenniferwhite', 'Budget approver for corporate travel'),
(2, 'Robert', 'Brown', 'r.brown@globalfinance.com', '+1-555-2002', 'VP Travel', 'travel', TRUE, 'https://linkedin.com/in/robertbrown', 'Travel policy and vendor management'),
(3, 'Lisa', 'Anderson', 'l.anderson@healthtech.com', '+1-555-3001', 'President', 'executive', TRUE, 'https://linkedin.com/in/lisaanderson', 'Executive leadership for travel decisions'),
(4, 'David', 'Wilson', 'd.wilson@manufacturingcorp.com', '+1-555-4001', 'Operations Director', 'operations', TRUE, 'https://linkedin.com/in/davidwilson', 'Manufacturing operations and logistics'),
(5, 'Amanda', 'Taylor', 'a.taylor@edutech.com', '+1-555-5001', 'COO', 'operations', TRUE, 'https://linkedin.com/in/amandataylor', 'Education sector operations');

-- Leads
INSERT INTO api_lead (company_id, contact_id, status, source, priority, score, estimated_value, notes, assigned_to_id, assigned_agent, next_action, next_action_date) VALUES
(1, 1, 'qualified', 'corporate_search', 'high', 85, 500000.00, 'Strong interest in premium travel services', 1, 'John Doe', 'Schedule executive presentation', '2025-01-15 14:00:00+00'),
(1, 2, 'contacted', 'referral', 'medium', 70, 300000.00, 'Referred by existing client', 2, 'Jane Smith', 'Follow up on proposal', '2025-01-10 10:00:00+00'),
(2, 4, 'proposal_sent', 'marketing', 'high', 90, 750000.00, 'Large enterprise with global needs', 1, 'John Doe', 'Await decision feedback', '2025-01-20 16:00:00+00'),
(3, 6, 'negotiation', 'cold_outreach', 'medium', 75, 200000.00, 'Healthcare sector opportunity', 3, 'Mike Wilson', 'Negotiate contract terms', '2025-01-12 13:00:00+00'),
(4, 7, 'new', 'website', 'low', 45, 150000.00, 'Manufacturing sector lead', 2, 'Jane Smith', 'Initial qualification call', '2025-01-08 11:00:00+00'),
(5, 8, 'qualified', 'social_media', 'medium', 65, 100000.00, 'Education technology sector', 3, 'Mike Wilson', 'Prepare sector-specific proposal', '2025-01-14 15:00:00+00');

-- Opportunities
INSERT INTO api_opportunity (lead_id, name, stage, probability, estimated_close_date, value, description, next_steps) VALUES
(1, 'TechCorp Premium Travel Program', 'proposal', 80, '2025-02-15', 500000.00, 'Comprehensive corporate travel program for TechCorp Solutions', 'Finalize proposal and schedule presentation'),
(3, 'Global Finance Enterprise Deal', 'negotiation', 90, '2025-03-01', 750000.00, 'Global travel management solution for international operations', 'Complete contract negotiations and pricing discussions'),
(4, 'HealthTech Medical Travel Services', 'discovery', 60, '2025-02-28', 200000.00, 'Specialized medical conference and research travel program', 'Conduct needs assessment and solution design');

-- Opportunity Activities
INSERT INTO api_opportunityactivity (opportunity_id, type, description, date, created_by_id) VALUES
(1, 'call', 'Initial discovery call with CEO John Smith', '2024-12-15', 1),
(1, 'email', 'Sent detailed proposal and pricing', '2024-12-20', 1),
(1, 'meeting', 'On-site presentation to executive team', '2025-01-05', 1),
(2, 'demo', 'Platform demonstration for finance team', '2024-12-10', 1),
(2, 'proposal', 'Comprehensive proposal for global program', '2024-12-25', 1),
(3, 'call', 'Needs assessment call with operations', '2025-01-02', 3);

-- Lead Notes
INSERT INTO api_leadnote (lead_id, note, next_action, urgency, created_by_id) VALUES
(1, 'CEO very interested in sustainable travel options. Emphasized cost control and carbon footprint reduction.', 'Prepare sustainability-focused proposal', 'High', 1),
(2, 'VP Operations mentioned budget constraints but interested in value-added services.', 'Focus on ROI and cost savings in next meeting', 'Medium', 2),
(3, 'CFO requires detailed financial analysis and benchmark comparisons.', 'Prepare comprehensive financial analysis', 'High', 1),
(4, 'Healthcare compliance requirements are critical for this deal.', 'Research healthcare travel compliance standards', 'Medium', 3);

-- Lead History
INSERT INTO api_leadhistory (lead_id, history_type, action, details, icon, user_id, metadata) VALUES
(1, 'creation', 'Lead Created', 'New lead created from corporate search', 'plus', 1, '{"source": "corporate_search"}'),
(1, 'status_change', 'Status Changed', 'Status changed from new to contacted', 'trending-up', 1, '{"old_status": "new", "new_status": "contacted"}'),
(1, 'status_change', 'Status Changed', 'Status changed from contacted to qualified', 'trending-up', 1, '{"old_status": "contacted", "new_status": "qualified"}'),
(2, 'creation', 'Lead Created', 'New lead created from referral', 'plus', 2, '{"source": "referral"}'),
(2, 'contact_made', 'Contact Made', 'Initial phone call completed', 'phone', 2, '{"duration": "30 minutes"}'),
(3, 'creation', 'Lead Created', 'New lead created from marketing campaign', 'plus', 1, '{"source": "marketing"}'),
(3, 'proposal_sent', 'Proposal Sent', 'Comprehensive proposal sent to CFO', 'file-text', 1, '{"proposal_value": 750000}');

-- Support Tickets
INSERT INTO api_supportticket (ticket_number, company_id, contact_id, subject, description, category, priority, status, assigned_to_id) VALUES
('TKT-20250101-ABC123', 1, 1, 'Travel Booking System Access Issue', 'Unable to access the corporate travel booking platform', 'technical', 'high', 'in_progress', 2),
('TKT-20250102-DEF456', 2, 4, 'Invoice Discrepancy Question', 'Question about recent travel invoice charges', 'billing', 'medium', 'open', 3),
('TKT-20250103-GHI789', 3, 6, 'Flight Change Request', 'Need to change flight for medical conference', 'booking', 'urgent', 'resolved', 1);

-- Revenue Forecasts
INSERT INTO api_revenueforecast (period_type, period, forecasted_revenue, actual_revenue, confidence_level, factors, notes) VALUES
('quarterly', '2025-Q1', 2500000.00, NULL, 85, '{"new_deals": 3, "renewal_rate": 0.95, "market_growth": 0.12}', 'Strong pipeline with enterprise deals'),
('quarterly', '2025-Q2', 3200000.00, NULL, 80, '{"new_deals": 5, "renewal_rate": 0.93, "market_growth": 0.15}', 'Aggressive growth targets with new market expansion'),
('monthly', '2025-01', 800000.00, NULL, 90, '{"confirmed_deals": 2, "probable_deals": 3}', 'High confidence based on advanced negotiations');

-- Travel Offers
INSERT INTO api_traveloffer (title, description, offer_type, status, discount_percentage, base_price, discounted_price, valid_from, valid_until, terms_conditions, created_by_id) VALUES
('Corporate Rate Q1 2025', 'Special corporate rates for Q1 business travel', 'corporate_rate', 'active', 15.00, 1000.00, 850.00, '2025-01-01 00:00:00+00', '2025-03-31 23:59:59+00', 'Valid for advance bookings, minimum 7-day advance notice required', 1),
('Group Booking Discount', 'Volume discount for group bookings of 10+ travelers', 'group_booking', 'active', 20.00, 800.00, 640.00, '2025-01-01 00:00:00+00', '2025-12-31 23:59:59+00', 'Minimum 10 travelers, same destination and dates', 2);

-- Email Campaigns
INSERT INTO api_emailcampaign (name, description, campaign_type, status, subject_line, email_content, emails_sent, emails_opened, emails_clicked) VALUES
('Q1 Travel Deals', 'Quarterly promotion for corporate travel deals', 'promotion', 'completed', 'Exclusive Q1 Corporate Travel Offers', 'Dear valued client, we are excited to present our exclusive Q1 travel offers...', 150, 75, 25),
('Lead Nurture Series', 'Educational content for prospects in discovery phase', 'nurture', 'active', 'Optimizing Your Corporate Travel Program', 'Learn how leading companies are transforming their travel programs...', 200, 120, 45);

-- Activity Logs
INSERT INTO api_activitylog (user_id, action_type, action, entity_type, entity_id, details) VALUES
(1, 'create', 'Created new opportunity', 'Opportunity', 1, '{"opportunity_name": "TechCorp Premium Travel Program", "value": 500000}'),
(1, 'update', 'Updated lead status', 'Lead', 1, '{"old_status": "contacted", "new_status": "qualified"}'),
(2, 'create', 'Created support ticket', 'SupportTicket', 1, '{"ticket_number": "TKT-20250101-ABC123", "priority": "high"}');

-- AI Conversations
INSERT INTO api_aiconversation (user_id, session_id, query, response, context, entities_mentioned, actions_suggested) VALUES
(1, gen_random_uuid(), 'Show me the top opportunities by value', 'Here are your top opportunities by value: 1. Global Finance Enterprise Deal - $750,000...', '{"user_role": "sales_manager", "current_view": "opportunities"}', '["Global Finance Enterprise Deal", "TechCorp Premium Travel Program"]', '["view_opportunity_details", "schedule_follow_up"]'),
(2, gen_random_uuid(), 'What leads need follow-up this week?', 'Based on your pipeline, 3 leads require follow-up this week: TechCorp Solutions, HealthTech Innovations...', '{"user_role": "sales_rep", "date_range": "this_week"}', '["TechCorp Solutions", "HealthTech Innovations"]', '["schedule_calls", "send_follow_up_emails"]');

-- Reset sequence values (prevents ID conflicts when Django adds new records)
SELECT setval('auth_user_id_seq', COALESCE((SELECT MAX(id) FROM auth_user), 1));
SELECT setval('api_company_id_seq', COALESCE((SELECT MAX(id) FROM api_company), 1));
SELECT setval('api_contact_id_seq', COALESCE((SELECT MAX(id) FROM api_contact), 1));
SELECT setval('api_lead_id_seq', COALESCE((SELECT MAX(id) FROM api_lead), 1));
SELECT setval('api_opportunity_id_seq', COALESCE((SELECT MAX(id) FROM api_opportunity), 1));
SELECT setval('api_opportunityactivity_id_seq', COALESCE((SELECT MAX(id) FROM api_opportunityactivity), 1));
SELECT setval('api_leadnote_id_seq', COALESCE((SELECT MAX(id) FROM api_leadnote), 1));
SELECT setval('api_leadhistory_id_seq', COALESCE((SELECT MAX(id) FROM api_leadhistory), 1));
SELECT setval('api_supportticket_id_seq', COALESCE((SELECT MAX(id) FROM api_supportticket), 1));
SELECT setval('api_revenueforecast_id_seq', COALESCE((SELECT MAX(id) FROM api_revenueforecast), 1));
SELECT setval('api_traveloffer_id_seq', COALESCE((SELECT MAX(id) FROM api_traveloffer), 1));
SELECT setval('api_emailcampaign_id_seq', COALESCE((SELECT MAX(id) FROM api_emailcampaign), 1));
SELECT setval('api_activitylog_id_seq', COALESCE((SELECT MAX(id) FROM api_activitylog), 1));
SELECT setval('api_aiconversation_id_seq', COALESCE((SELECT MAX(id) FROM api_aiconversation), 1));

-- Sample data import complete
COMMIT;
