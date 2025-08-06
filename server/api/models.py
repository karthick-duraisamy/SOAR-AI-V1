
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class Company(models.Model):
    COMPANY_SIZES = [
        ('startup', 'Startup (1-10)'),
        ('small', 'Small (11-50)'),
        ('medium', 'Medium (51-200)'),
        ('large', 'Large (201-1000)'),
        ('enterprise', 'Enterprise (1000+)'),
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

    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=50, choices=INDUSTRIES)
    size = models.CharField(max_length=20, choices=COMPANY_SIZES)
    location = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    employee_count = models.IntegerField(null=True, blank=True)
    travel_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
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
