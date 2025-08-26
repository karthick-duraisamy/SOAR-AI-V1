from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class Company(models.Model):
    COMPANY_SIZES = [
        ('startup', 'Startup (1-50)'),
        ('small', 'Small (51-200)'),
        ('medium', 'Medium (201-1000)'),
        ('large', 'Large (1001-5000)'),
        ('enterprise', 'Enterprise (5000+)'),
        ('corporation', 'Corporation'),
        ('llc', 'LLC'),
        ('partnership', 'Partnership'),
        ('nonprofit', 'Non-Profit'),
    ]

    INDUSTRIES = [
        ('technology', 'Technology'),
        ('finance', 'Finance & Banking'),
        ('healthcare', 'Healthcare'),
        ('manufacturing', 'Manufacturing'),
        ('retail', 'Retail'),
        ('consulting', 'Consulting'),
        ('telecommunications', 'Telecommunications'),
        ('energy', 'Energy & Utilities'),
        ('transportation', 'Transportation'),
        ('education', 'Education'),
        ('government', 'Government'),
        ('other', 'Other'),
    ]

    TRAVEL_FREQUENCY_CHOICES = [
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
        ('Quarterly', 'Quarterly'),
        ('Bi-weekly', 'Bi-weekly'),
    ]

    PREFERRED_CLASS_CHOICES = [
        ('Economy', 'Economy'),
        ('Economy Plus', 'Economy Plus'),
        ('Business', 'Business'),
        ('First', 'First Class'),
        ('Business/First', 'Business/First'),
    ]

    CREDIT_RATING_CHOICES = [
        ('AAA', 'AAA'),
        ('AA', 'AA'),
        ('A', 'A'),
        ('BBB', 'BBB'),
        ('BB', 'BB'),
    ]

    PAYMENT_TERMS_CHOICES = [
        ('Net 15', 'Net 15'),
        ('Net 30', 'Net 30'),
        ('Net 45', 'Net 45'),
        ('Net 60', 'Net 60'),
    ]

    SUSTAINABILITY_CHOICES = [
        ('Very High', 'Very High'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    RISK_LEVEL_CHOICES = [
        ('Very Low', 'Very Low'),
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    EXPANSION_CHOICES = [
        ('Aggressive', 'Aggressive'),
        ('Moderate', 'Moderate'),
        ('Conservative', 'Conservative'),
        ('Rapid', 'Rapid'),
        ('Stable', 'Stable'),
    ]

    # Basic Info fields
    name = models.CharField(max_length=255)
    company_type = models.CharField(max_length=50, choices=COMPANY_SIZES, blank=True)
    industry = models.CharField(max_length=50, choices=INDUSTRIES)
    location = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True, null=True)

    # Business Details fields
    employee_count = models.IntegerField(null=True, blank=True)
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    year_established = models.IntegerField(null=True, blank=True)
    size = models.CharField(max_length=20, choices=COMPANY_SIZES)
    credit_rating = models.CharField(max_length=10, choices=CREDIT_RATING_CHOICES, blank=True)
    payment_terms = models.CharField(max_length=20, choices=PAYMENT_TERMS_CHOICES, blank=True)

    # Travel Profile fields
    travel_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    annual_travel_volume = models.CharField(max_length=100, blank=True)
    travel_frequency = models.CharField(max_length=20, choices=TRAVEL_FREQUENCY_CHOICES, blank=True)
    preferred_class = models.CharField(max_length=20, choices=PREFERRED_CLASS_CHOICES, blank=True)
    sustainability_focus = models.CharField(max_length=20, choices=SUSTAINABILITY_CHOICES, blank=True)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES, blank=True)
    current_airlines = models.TextField(blank=True)  # Store as comma-separated values

    # Additional Info fields
    expansion_plans = models.CharField(max_length=20, choices=EXPANSION_CHOICES, blank=True)
    specialties = models.TextField(blank=True)  # Store as comma-separated values
    technology_integration = models.TextField(blank=True)  # Store as comma-separated values
    description = models.TextField(blank=True)  # This will be used for additional notes

    is_active = models.BooleanField(default=True)
    move_as_lead = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Contact(models.Model):
    DEPARTMENTS = [
        ('executive', 'Executive'),
        ('finance', 'Finance'),
        ('hr', 'Human Resources'),
        ('operations', 'Operations'),
        ('travel', 'Travel Management'),
        ('procurement', 'Procurement'),
        ('it', 'IT'),
        ('marketing', 'Marketing'),
        ('sales', 'Sales'),
        ('other', 'Other'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=20, choices=DEPARTMENTS, blank=True)
    is_decision_maker = models.BooleanField(default=False)
    linkedin_profile = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company.name}"

class Lead(models.Model):
    LEAD_STATUS_CHOICES = [
        ('new', 'New'),
        ('qualified', 'Qualified'),
        ('unqualified', 'Unqualified'),
        ('contacted', 'Contacted'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiation', 'In Negotiation'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    LEAD_SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('cold_outreach', 'Cold Outreach'),
        ('marketing', 'Marketing Campaign'),
        ('social_media', 'Social Media'),
        ('corporate_search', 'Corporate Search'),
        ('ai_discovery', 'AI Discovery'),
    ]

    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=LEAD_STATUS_CHOICES, default='new')
    source = models.CharField(max_length=20, choices=LEAD_SOURCE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    score = models.IntegerField(default=0)
    estimated_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_agent = models.CharField(max_length=255, blank=True, null=True)
    next_action = models.CharField(max_length=255, blank=True)
    next_action_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lead: {self.company.name} - {self.status}"

class Opportunity(models.Model):
    OPPORTUNITY_STAGES = [
        ('discovery', 'Discovery'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('closed_won', 'Closed Won'),
        ('closed_lost', 'Closed Lost'),
    ]

    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='opportunity')
    name = models.CharField(max_length=255)
    stage = models.CharField(max_length=20, choices=OPPORTUNITY_STAGES, default='discovery')
    probability = models.IntegerField(default=0)
    estimated_close_date = models.DateField()
    actual_close_date = models.DateField(null=True, blank=True)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    next_steps = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.stage}"

class OpportunityActivity(models.Model):
    ACTIVITY_TYPES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('demo', 'Demo'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('other', 'Other'),
    ]

    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name_plural = 'Opportunity Activities'

    def __str__(self):
        return f"{self.get_type_display()} - {self.opportunity.name}"

class Contract(models.Model):
    CONTRACT_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_signature', 'Pending Signature'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
        ('at_risk', 'At Risk'),
        ('breach', 'In Breach'),
    ]

    CONTRACT_TYPES = [
        ('corporate_travel', 'Corporate Travel Agreement'),
        ('service_agreement', 'Service Agreement'),
        ('master_agreement', 'Master Service Agreement'),
        ('vendor_contract', 'Vendor Contract'),
        ('nda', 'Non-Disclosure Agreement'),
        ('other', 'Other'),
    ]

    opportunity = models.OneToOneField(Opportunity, on_delete=models.CASCADE, related_name='contract', null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contract_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    contract_type = models.CharField(max_length=30, choices=CONTRACT_TYPES, default='corporate_travel')
    status = models.CharField(max_length=20, choices=CONTRACT_STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=12, decimal_places=2)
    terms = models.TextField()
    renewal_terms = models.TextField(blank=True)
    auto_renewal = models.BooleanField(default=False)
    notice_period_days = models.IntegerField(default=30)
    risk_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.contract_number} - {self.title}"

class ContractBreach(models.Model):
    BREACH_TYPES = [
        ('payment', 'Payment Delay'),
        ('service_level', 'Service Level Violation'),
        ('compliance', 'Compliance Issue'),
        ('delivery', 'Delivery Delay'),
        ('quality', 'Quality Issue'),
        ('other', 'Other'),
    ]

    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='breaches')
    breach_type = models.CharField(max_length=20, choices=BREACH_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    description = models.TextField()
    detected_date = models.DateTimeField(auto_now_add=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)
    financial_impact = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    resolution_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Breach: {self.contract.contract_number} - {self.breach_type}"

class CampaignTemplate(models.Model):
    CHANNEL_TYPE_CHOICES = [
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('linkedin', 'LinkedIn'),
        ('mixed', 'Multi-Channel'),
    ]

    LINKEDIN_TYPE_CHOICES = [
        ('message', 'Direct Message'),
        ('post', 'Post/Content'),
        ('connection', 'Connection Request'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    channel_type = models.CharField(max_length=20, choices=CHANNEL_TYPE_CHOICES, default='email')
    target_industry = models.CharField(max_length=100, default='All')
    subject_line = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    cta = models.CharField(max_length=255)
    linkedin_type = models.CharField(max_length=20, choices=LINKEDIN_TYPE_CHOICES, blank=True, null=True)
    estimated_open_rate = models.FloatField(default=40.0)
    estimated_click_rate = models.FloatField(default=10.0)
    is_custom = models.BooleanField(default=True)
    created_by = models.CharField(max_length=255, default='User')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class EmailCampaign(models.Model):
    CAMPAIGN_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]

    CAMPAIGN_TYPES = [
        ('nurture', 'Lead Nurture'),
        ('follow_up', 'Follow-up'),
        ('promotion', 'Promotional'),
        ('newsletter', 'Newsletter'),
        ('announcement', 'Announcement'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    campaign_type = models.CharField(max_length=20, choices=CAMPAIGN_TYPES, default='nurture')
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default='draft')
    subject_line = models.CharField(max_length=255)
    email_content = models.TextField()
    target_leads = models.ManyToManyField(Lead, blank=True)
    template = models.ForeignKey(CampaignTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
    sent_date = models.DateTimeField(null=True, blank=True)
    emails_sent = models.IntegerField(default=0)
    emails_opened = models.IntegerField(default=0)
    emails_clicked = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class TravelOffer(models.Model):
    OFFER_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('suspended', 'Suspended'),
    ]

    OFFER_TYPES = [
        ('corporate_rate', 'Corporate Rate'),
        ('group_booking', 'Group Booking'),
        ('advance_purchase', 'Advance Purchase'),
        ('flexible', 'Flexible Booking'),
        ('premium', 'Premium Service'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    offer_type = models.CharField(max_length=20, choices=OFFER_TYPES)
    status = models.CharField(max_length=15, choices=OFFER_STATUS_CHOICES, default='draft')
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    terms_conditions = models.TextField()
    target_companies = models.ManyToManyField(Company, blank=True)
    bookings_count = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class SupportTicket(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('waiting', 'Waiting for Response'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    CATEGORY_CHOICES = [
        ('technical', 'Technical Issue'),
        ('billing', 'Billing'),
        ('booking', 'Booking Support'),
        ('account', 'Account Management'),
        ('general', 'General Inquiry'),
        ('complaint', 'Complaint'),
    ]

    ticket_number = models.CharField(max_length=20, unique=True, default='')
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES, default='general')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    satisfaction_rating = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = f"TKT-{timezone.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_number} - {self.subject}"

class RevenueForecast(models.Model):
    PERIOD_TYPES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]

    period_type = models.CharField(max_length=15, choices=PERIOD_TYPES, default='monthly')
    period = models.CharField(max_length=20)
    forecasted_revenue = models.DecimalField(max_digits=15, decimal_places=2)
    actual_revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    confidence_level = models.IntegerField(default=80)
    factors = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Revenue Forecast {self.period}"

class LeadNote(models.Model):
    URGENCY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='lead_notes')
    note = models.TextField()
    next_action = models.CharField(max_length=255, blank=True)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='Medium')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note for {self.lead.company.name} - {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-created_at']

class LeadHistory(models.Model):
    HISTORY_TYPES = [
        ('creation', 'Lead Created'),
        ('status_change', 'Status Changed'),
        ('note_added', 'Note Added'),
        ('score_update', 'Score Updated'),
        ('agent_assignment', 'Agent Assigned'),
        ('agent_reassignment', 'Agent Reassigned'),
        ('assignment', 'Lead Assigned'),
        ('contact_made', 'Contact Made'),
        ('email_sent', 'Email Sent'),
        ('call_made', 'Call Made'),
        ('meeting_scheduled', 'Meeting Scheduled'),
        ('qualification', 'Lead Qualified'),
        ('disqualification', 'Lead Disqualified'),
        ('opportunity_created', 'Opportunity Created'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiation_started', 'Negotiation Started'),
        ('won', 'Lead Won'),
        ('lost', 'Lead Lost'),
    ]

    ICON_TYPES = [
        ('plus', 'Plus'),
        ('mail', 'Mail'),
        ('phone', 'Phone'),
        ('message-circle', 'Message Circle'),
        ('message-square', 'Message Square'),
        ('trending-up', 'Trending Up'),
        ('user', 'User'),
        ('check-circle', 'Check Circle'),
        ('x-circle', 'X Circle'),
        ('calendar', 'Calendar'),
        ('briefcase', 'Briefcase'),
        ('file-text', 'File Text'),
        ('handshake', 'Handshake'),
        ('trophy', 'Trophy'),
        ('x', 'X'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='history_entries')
    history_type = models.CharField(max_length=255)  # <- this must be here

    action = models.CharField(max_length=255)
    details = models.TextField()
    icon = models.CharField(max_length=20, choices=ICON_TYPES, default='plus')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead.company.name} - {self.action}"

    class Meta:
        ordering = ['timestamp']

class ActivityLog(models.Model):
    ACTION_TYPES = [
        ('create', 'Created'),
        ('update', 'Updated'),
        ('delete', 'Deleted'),
        ('view', 'Viewed'),
        ('export', 'Exported'),
        ('email_sent', 'Email Sent'),
        ('call_made', 'Call Made'),
        ('meeting_scheduled', 'Meeting Scheduled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    action = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=100)
    entity_id = models.IntegerField()
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} on {self.entity_type}"

    class Meta:
        ordering = ['-timestamp']

class AIConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.UUIDField(default=uuid.uuid4, unique=True)
    query = models.TextField()
    response = models.TextField()
    context = models.JSONField(default=dict, blank=True)
    entities_mentioned = models.JSONField(default=list, blank=True)
    actions_suggested = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Chat - {self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-created_at']