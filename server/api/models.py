
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Company(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    employee_count = models.IntegerField(null=True, blank=True)
    travel_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Contact(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True)
    is_decision_maker = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company.name}"

class Lead(models.Model):
    LEAD_STATUS_CHOICES = [
        ('new', 'New'),
        ('qualified', 'Qualified'),
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
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=LEAD_STATUS_CHOICES, default='new')
    source = models.CharField(max_length=20, choices=LEAD_SOURCE_CHOICES)
    score = models.IntegerField(default=0)
    estimated_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
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
    probability = models.IntegerField(default=0)  # 0-100%
    estimated_close_date = models.DateField()
    actual_close_date = models.DateField(null=True, blank=True)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
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
    ]

    opportunity = models.OneToOneField(Opportunity, on_delete=models.CASCADE, related_name='contract')
    contract_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=CONTRACT_STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=12, decimal_places=2)
    terms = models.TextField()
    renewal_terms = models.TextField(blank=True)
    auto_renewal = models.BooleanField(default=False)
    notice_period_days = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.contract_number} - {self.title}"

class Vendor(models.Model):
    name = models.CharField(max_length=255)
    service_type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    certification_level = models.CharField(max_length=50, blank=True)
    specialties = models.TextField(blank=True)
    pricing_model = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class MarketingCampaign(models.Model):
    CAMPAIGN_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    target_audience = models.TextField()
    channels = models.TextField()  # JSON field for multiple channels
    metrics = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

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

    ticket_number = models.CharField(max_length=20, unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.ticket_number} - {self.subject}"

class RevenueForecast(models.Model):
    period = models.CharField(max_length=20)  # e.g., "2024-Q1", "2024-01"
    forecasted_revenue = models.DecimalField(max_digits=15, decimal_places=2)
    actual_revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    confidence_level = models.IntegerField(default=80)  # 0-100%
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Revenue Forecast {self.period}"

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=100)
    entity_id = models.IntegerField()
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} on {self.entity_type}"

    class Meta:
        ordering = ['-timestamp']
