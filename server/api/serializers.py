
from rest_framework import serializers
from .models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast, 
    ActivityLog, AIConversation
)

class CompanySerializer(serializers.ModelSerializer):
    contacts_count = serializers.SerializerMethodField()
    leads_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = '__all__'
    
    def get_contacts_count(self, obj):
        return obj.contacts.count()
    
    def get_leads_count(self, obj):
        return obj.lead_set.count()
    
    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Company name is required.")
        return value.strip()
    
    def validate_industry(self, value):
        valid_industries = [choice[0] for choice in Company.INDUSTRIES]
        if value not in valid_industries:
            raise serializers.ValidationError(f"Invalid industry. Must be one of: {valid_industries}")
        return value
    
    def validate_size(self, value):
        valid_sizes = [choice[0] for choice in Company.COMPANY_SIZES]
        if value not in valid_sizes:
            raise serializers.ValidationError(f"Invalid size. Must be one of: {valid_sizes}")
        return value

    def validate_email(self, value):
        if value and not '@' in value:
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_annual_revenue(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Annual revenue cannot be negative.")
        return value

    def validate_employee_count(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Employee count must be at least 1.")
        return value

    def validate_travel_budget(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Travel budget cannot be negative.")
        return value

class ContactSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Contact
        fields = '__all__'
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class LeadSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    contact_name = serializers.CharField(source='contact.first_name', read_only=True)
    contact_full_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    days_since_created = serializers.SerializerMethodField()
    
    class Meta:
        model = Lead
        fields = '__all__'
    
    def get_contact_full_name(self, obj):
        return f"{obj.contact.first_name} {obj.contact.last_name}"
    
    def get_days_since_created(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.created_at).days

class OpportunitySerializer(serializers.ModelSerializer):
    lead_info = LeadSerializer(source='lead', read_only=True)
    company_name = serializers.CharField(source='lead.company.name', read_only=True)
    weighted_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Opportunity
        fields = '__all__'
    
    def get_weighted_value(self, obj):
        return float(obj.value) * (obj.probability / 100)

class ContractBreachSerializer(serializers.ModelSerializer):
    contract_title = serializers.CharField(source='contract.title', read_only=True)
    
    class Meta:
        model = ContractBreach
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    breaches = ContractBreachSerializer(many=True, read_only=True)
    days_until_expiry = serializers.SerializerMethodField()
    breach_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Contract
        fields = '__all__'
    
    def get_days_until_expiry(self, obj):
        from django.utils import timezone
        return (obj.end_date - timezone.now().date()).days
    
    def get_breach_count(self, obj):
        return obj.breaches.filter(is_resolved=False).count()

class EmailCampaignSerializer(serializers.ModelSerializer):
    target_leads_count = serializers.SerializerMethodField()
    open_rate = serializers.SerializerMethodField()
    click_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = EmailCampaign
        fields = '__all__'
    
    def get_target_leads_count(self, obj):
        return obj.target_leads.count()
    
    def get_open_rate(self, obj):
        if obj.emails_sent == 0:
            return 0
        return (obj.emails_opened / obj.emails_sent) * 100
    
    def get_click_rate(self, obj):
        if obj.emails_sent == 0:
            return 0
        return (obj.emails_clicked / obj.emails_sent) * 100

class TravelOfferSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    target_companies_count = serializers.SerializerMethodField()
    conversion_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = TravelOffer
        fields = '__all__'
    
    def get_target_companies_count(self, obj):
        return obj.target_companies.count()
    
    def get_conversion_rate(self, obj):
        if obj.target_companies.count() == 0:
            return 0
        return (obj.bookings_count / obj.target_companies.count()) * 100

class SupportTicketSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    contact_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    age_in_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = '__all__'
    
    def get_contact_name(self, obj):
        return f"{obj.contact.first_name} {obj.contact.last_name}"
    
    def get_age_in_hours(self, obj):
        from django.utils import timezone
        return int((timezone.now() - obj.created_at).total_seconds() / 3600)

class RevenueForecastSerializer(serializers.ModelSerializer):
    accuracy_percentage = serializers.SerializerMethodField()
    variance = serializers.SerializerMethodField()
    
    class Meta:
        model = RevenueForecast
        fields = '__all__'
    
    def get_accuracy_percentage(self, obj):
        if not obj.actual_revenue:
            return None
        variance = abs(obj.forecasted_revenue - obj.actual_revenue)
        accuracy = ((obj.forecasted_revenue - variance) / obj.forecasted_revenue) * 100
        return max(0, accuracy)
    
    def get_variance(self, obj):
        if not obj.actual_revenue:
            return None
        return obj.actual_revenue - obj.forecasted_revenue

class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivityLog
        fields = '__all__'
    
    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user.first_name else obj.user.username

class AIConversationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AIConversation
        fields = '__all__'
