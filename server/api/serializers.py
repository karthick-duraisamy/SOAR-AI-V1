
from rest_framework import serializers
from .models import (
    Company, Contact, Lead, Opportunity, Contract, Vendor,
    MarketingCampaign, SupportTicket, RevenueForecast, ActivityLog
)

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class LeadSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    contact_name = serializers.CharField(source='contact.first_name', read_only=True)
    
    class Meta:
        model = Lead
        fields = '__all__'

class OpportunitySerializer(serializers.ModelSerializer):
    lead_info = LeadSerializer(source='lead', read_only=True)
    
    class Meta:
        model = Opportunity
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='opportunity.lead.company.name', read_only=True)
    
    class Meta:
        model = Contract
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class MarketingCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingCampaign
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    contact_name = serializers.CharField(source='contact.first_name', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = '__all__'

class RevenueForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueForecast
        fields = '__all__'

class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = '__all__'
