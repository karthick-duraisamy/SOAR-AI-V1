
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
import random
from decimal import Decimal

from api.models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast, 
    ActivityLog, AIConversation
)

class Command(BaseCommand):
    help = 'Populate the database with sample data for SOAR-AI platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting data population...'))
        
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@soar-ai.com', 'admin123')
            self.stdout.write('Created admin user')
        
        # Create sample users
        users = []
        for i in range(5):
            user, created = User.objects.get_or_create(
                username=f'user{i+1}',
                defaults={
                    'first_name': ['John', 'Jane', 'Mike', 'Sarah', 'David'][i],
                    'last_name': ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'][i],
                    'email': f'user{i+1}@soar-ai.com'
                }
            )
            users.append(user)
        
        # Create companies
        companies_data = [
            {
                'name': 'TechCorp Solutions',
                'industry': 'technology',
                'size': 'large',
                'location': 'San Francisco, CA',
                'website': 'https://techcorp.com',
                'annual_revenue': Decimal('50000000'),
                'employee_count': 500,
                'travel_budget': Decimal('2000000'),
                'description': 'Leading technology solutions provider'
            },
            {
                'name': 'Global Finance Ltd',
                'industry': 'finance',
                'size': 'enterprise',
                'location': 'New York, NY',
                'website': 'https://globalfinance.com',
                'annual_revenue': Decimal('200000000'),
                'employee_count': 2000,
                'travel_budget': Decimal('5000000'),
                'description': 'International financial services company'
            },
            {
                'name': 'HealthTech Innovations',
                'industry': 'healthcare',
                'size': 'medium',
                'location': 'Boston, MA',
                'website': 'https://healthtech.com',
                'annual_revenue': Decimal('25000000'),
                'employee_count': 200,
                'travel_budget': Decimal('800000'),
                'description': 'Healthcare technology and services'
            },
            {
                'name': 'Manufacturing Plus',
                'industry': 'manufacturing',
                'size': 'large',
                'location': 'Detroit, MI',
                'website': 'https://mfgplus.com',
                'annual_revenue': Decimal('75000000'),
                'employee_count': 800,
                'travel_budget': Decimal('1500000'),
                'description': 'Advanced manufacturing solutions'
            },
            {
                'name': 'Retail Dynamics',
                'industry': 'retail',
                'size': 'enterprise',
                'location': 'Chicago, IL',
                'website': 'https://retaildyn.com',
                'annual_revenue': Decimal('150000000'),
                'employee_count': 1500,
                'travel_budget': Decimal('3000000'),
                'description': 'Multi-channel retail operations'
            },
            {
                'name': 'ConsultPro Services',
                'industry': 'consulting',
                'size': 'medium',
                'location': 'Washington, DC',
                'website': 'https://consultpro.com',
                'annual_revenue': Decimal('30000000'),
                'employee_count': 150,
                'travel_budget': Decimal('1200000'),
                'description': 'Strategic business consulting'
            }
        ]
        
        companies = []
        for company_data in companies_data:
            company, created = Company.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
            companies.append(company)
        
        self.stdout.write(f'Created {len(companies)} companies')
        
        # Create contacts
        contacts_data = [
            {'first_name': 'Robert', 'last_name': 'Anderson', 'email': 'r.anderson@techcorp.com', 'position': 'CTO', 'department': 'executive', 'is_decision_maker': True},
            {'first_name': 'Lisa', 'last_name': 'Martinez', 'email': 'l.martinez@techcorp.com', 'position': 'Travel Manager', 'department': 'travel', 'is_decision_maker': False},
            {'first_name': 'Michael', 'last_name': 'Thompson', 'email': 'm.thompson@globalfinance.com', 'position': 'CFO', 'department': 'finance', 'is_decision_maker': True},
            {'first_name': 'Jennifer', 'last_name': 'White', 'email': 'j.white@globalfinance.com', 'position': 'Operations Director', 'department': 'operations', 'is_decision_maker': True},
            {'first_name': 'David', 'last_name': 'Garcia', 'email': 'd.garcia@healthtech.com', 'position': 'CEO', 'department': 'executive', 'is_decision_maker': True},
            {'first_name': 'Amanda', 'last_name': 'Rodriguez', 'email': 'a.rodriguez@mfgplus.com', 'position': 'VP Operations', 'department': 'operations', 'is_decision_maker': True},
            {'first_name': 'James', 'last_name': 'Wilson', 'email': 'j.wilson@retaildyn.com', 'position': 'Travel Coordinator', 'department': 'travel', 'is_decision_maker': False},
            {'first_name': 'Sarah', 'last_name': 'Lee', 'email': 's.lee@consultpro.com', 'position': 'Managing Partner', 'department': 'executive', 'is_decision_maker': True}
        ]
        
        contacts = []
        for i, contact_data in enumerate(contacts_data):
            contact_data['company'] = companies[i % len(companies)]
            contact_data['phone'] = f'+1-555-{random.randint(1000, 9999)}'
            contact, created = Contact.objects.get_or_create(
                email=contact_data['email'],
                defaults=contact_data
            )
            contacts.append(contact)
        
        self.stdout.write(f'Created {len(contacts)} contacts')
        
        # Create leads
        lead_statuses = ['new', 'qualified', 'unqualified', 'contacted', 'proposal_sent', 'negotiation', 'won', 'lost']
        lead_sources = ['website', 'referral', 'cold_outreach', 'marketing', 'corporate_search']
        priorities = ['low', 'medium', 'high', 'urgent']
        
        leads = []
        for i in range(15):
            lead_data = {
                'company': random.choice(companies),
                'contact': random.choice(contacts),
                'status': random.choice(lead_statuses),
                'source': random.choice(lead_sources),
                'priority': random.choice(priorities),
                'score': random.randint(1, 100),
                'estimated_value': Decimal(str(random.randint(50000, 500000))),
                'notes': f'Sample lead notes for lead {i+1}',
                'assigned_to': random.choice(users),
                'next_action': random.choice(['Call client', 'Send proposal', 'Schedule meeting', 'Follow up']),
                'next_action_date': timezone.now() + timedelta(days=random.randint(1, 30))
            }
            lead = Lead.objects.create(**lead_data)
            leads.append(lead)
        
        self.stdout.write(f'Created {len(leads)} leads')
        
        # Create opportunities
        opportunity_stages = ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
        qualified_leads = [lead for lead in leads if lead.status in ['qualified', 'contacted', 'proposal_sent', 'negotiation', 'won']]
        
        opportunities = []
        for i, lead in enumerate(qualified_leads[:8]):
            opportunity_data = {
                'lead': lead,
                'name': f'Travel Services Opportunity - {lead.company.name}',
                'stage': random.choice(opportunity_stages),
                'probability': random.randint(10, 90),
                'estimated_close_date': timezone.now().date() + timedelta(days=random.randint(30, 180)),
                'value': Decimal(str(random.randint(100000, 1000000))),
                'description': f'Corporate travel services opportunity with {lead.company.name}',
                'next_steps': 'Prepare detailed proposal and schedule presentation'
            }
            opportunity = Opportunity.objects.create(**opportunity_data)
            opportunities.append(opportunity)
        
        self.stdout.write(f'Created {len(opportunities)} opportunities')
        
        # Create contracts
        contract_statuses = ['draft', 'pending_signature', 'active', 'expired', 'terminated', 'at_risk']
        contract_types = ['corporate_travel', 'service_agreement', 'master_agreement', 'vendor_contract']
        
        contracts = []
        for i, opportunity in enumerate(opportunities[:6]):
            contract_number = f'CNT-2024-{str(i+1001).zfill(4)}'
            contract_data = {
                'opportunity': opportunity,
                'company': opportunity.lead.company,
                'contract_number': contract_number,
                'title': f'Corporate Travel Agreement - {opportunity.lead.company.name}',
                'contract_type': random.choice(contract_types),
                'status': random.choice(contract_statuses),
                'start_date': timezone.now().date(),
                'end_date': timezone.now().date() + timedelta(days=365),
                'value': opportunity.value,
                'terms': 'Standard corporate travel agreement terms and conditions',
                'renewal_terms': 'Auto-renewal for 12 months unless terminated with 30 days notice',
                'auto_renewal': random.choice([True, False]),
                'notice_period_days': random.choice([30, 60, 90]),
                'risk_score': random.randint(1, 10)
            }
            contract, created = Contract.objects.get_or_create(
                contract_number=contract_number,
                defaults=contract_data
            )
            contracts.append(contract)
        
        self.stdout.write(f'Created {len(contracts)} contracts')
        
        # Create contract breaches
        breach_types = ['payment', 'service_level', 'compliance', 'delivery', 'quality']
        severity_levels = ['low', 'medium', 'high', 'critical']
        
        for i in range(3):
            contract = random.choice([c for c in contracts if c.status == 'active'])
            ContractBreach.objects.create(
                contract=contract,
                breach_type=random.choice(breach_types),
                severity=random.choice(severity_levels),
                description=f'Sample breach description for contract {contract.contract_number}',
                financial_impact=Decimal(str(random.randint(1000, 50000))),
                is_resolved=random.choice([True, False])
            )
        
        # Create email campaigns
        campaign_types = ['nurture', 'follow_up', 'promotion', 'newsletter']
        campaign_statuses = ['draft', 'scheduled', 'active', 'completed']
        
        for i in range(5):
            campaign = EmailCampaign.objects.create(
                name=f'Q{random.randint(1,4)} 2024 Campaign {i+1}',
                description=f'Sample email campaign {i+1}',
                campaign_type=random.choice(campaign_types),
                status=random.choice(campaign_statuses),
                subject_line=f'Your Corporate Travel Solutions - Campaign {i+1}',
                email_content='Sample email content with corporate travel offers and updates.',
                scheduled_date=timezone.now() + timedelta(days=random.randint(1, 30)),
                emails_sent=random.randint(100, 1000),
                emails_opened=random.randint(20, 300),
                emails_clicked=random.randint(5, 50)
            )
            # Add some target leads
            campaign.target_leads.set(random.sample(leads, min(5, len(leads))))
        
        self.stdout.write('Created 5 email campaigns')
        
        # Create travel offers
        offer_types = ['corporate_rate', 'group_booking', 'advance_purchase', 'flexible', 'premium']
        offer_statuses = ['draft', 'active', 'expired', 'suspended']
        
        for i in range(8):
            TravelOffer.objects.create(
                title=f'Corporate Travel Offer {i+1}',
                description=f'Special corporate travel package {i+1} with exclusive benefits',
                offer_type=random.choice(offer_types),
                status=random.choice(offer_statuses),
                discount_percentage=Decimal(str(random.randint(10, 30))),
                base_price=Decimal(str(random.randint(500, 2000))),
                discounted_price=Decimal(str(random.randint(350, 1500))),
                valid_from=timezone.now(),
                valid_until=timezone.now() + timedelta(days=random.randint(30, 180)),
                terms_conditions='Standard terms and conditions apply',
                bookings_count=random.randint(0, 50),
                revenue_generated=Decimal(str(random.randint(10000, 100000))),
                created_by=random.choice(users)
            )
        
        self.stdout.write('Created 8 travel offers')
        
        # Create support tickets
        ticket_priorities = ['low', 'medium', 'high', 'urgent']
        ticket_statuses = ['open', 'in_progress', 'waiting', 'resolved', 'closed']
        ticket_categories = ['technical', 'billing', 'booking', 'account', 'general', 'complaint']
        
        for i in range(12):
            subject = f'Support Request #{i+1}'
            if not SupportTicket.objects.filter(subject=subject).exists():
                SupportTicket.objects.create(
                    company=random.choice(companies),
                    contact=random.choice(contacts),
                    subject=subject,
                    description=f'Sample support ticket description {i+1}',
                    category=random.choice(ticket_categories),
                    priority=random.choice(ticket_priorities),
                    status=random.choice(ticket_statuses),
                    assigned_to=random.choice(users),
                    resolution_notes='Sample resolution notes' if random.choice([True, False]) else '',
                    satisfaction_rating=random.randint(1, 5) if random.choice([True, False]) else None
                )
        
        self.stdout.write('Created 12 support tickets')
        
        # Create revenue forecasts
        months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                  '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12']
        
        for month in months:
            forecasted = Decimal(str(random.randint(500000, 2000000)))
            actual = Decimal(str(random.randint(400000, 1800000))) if random.choice([True, False]) else None
            
            RevenueForecast.objects.get_or_create(
                period_type='monthly',
                period=month,
                defaults={
                    'forecasted_revenue': forecasted,
                    'actual_revenue': actual,
                    'confidence_level': random.randint(70, 95),
                    'factors': {'market_conditions': 'stable', 'seasonal_trend': 'normal'},
                    'notes': f'Revenue forecast for {month}'
                }
            )
        
        self.stdout.write('Created 12 revenue forecasts')
        
        # Create activity logs
        actions = ['create', 'update', 'view', 'email_sent', 'call_made']
        entities = ['Lead', 'Company', 'Contract', 'Opportunity', 'Ticket']
        
        for i in range(50):
            ActivityLog.objects.create(
                user=random.choice(users),
                action_type=random.choice(actions),
                action=f'Sample action {i+1}',
                entity_type=random.choice(entities),
                entity_id=random.randint(1, 10),
                details={'sample': 'data'},
                timestamp=timezone.now() - timedelta(days=random.randint(0, 30))
            )
        
        self.stdout.write('Created 50 activity logs')
        
        # Create AI conversations
        sample_queries = [
            "Show me all qualified leads",
            "What's the status of contract CNT-2024-1001?",
            "Generate a revenue report for this quarter",
            "Find companies in the technology sector",
            "Create a follow-up campaign for unqualified leads",
            "Show me high-priority support tickets",
            "What's the conversion rate for leads this month?",
            "Find contracts expiring in the next 30 days"
        ]
        
        for query in sample_queries:
            AIConversation.objects.create(
                user=random.choice(users),
                query=query,
                response=f"Based on your query '{query}', here are the relevant insights and recommendations...",
                context={'source': 'dashboard'},
                entities_mentioned=['leads', 'contracts', 'companies'],
                actions_suggested=['View Dashboard', 'Generate Report', 'Create Campaign']
            )
        
        self.stdout.write('Created 8 AI conversations')
        
        self.stdout.write(self.style.SUCCESS('✅ Database population completed successfully!'))
        self.stdout.write(self.style.SUCCESS('🔑 Admin credentials: username=admin, password=admin123'))
        self.stdout.write(self.style.SUCCESS('🚀 Your SOAR-AI platform is ready to use!'))
