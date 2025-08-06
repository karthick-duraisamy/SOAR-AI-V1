
from django.contrib import admin
from .models import (
    Company, Contact, Lead, Opportunity, Contract, Vendor,
    MarketingCampaign, SupportTicket, RevenueForecast, ActivityLog
)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'size', 'location', 'created_at']
    list_filter = ['industry', 'size']
    search_fields = ['name', 'location']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'company', 'position']
    list_filter = ['is_decision_maker', 'department']
    search_fields = ['first_name', 'last_name', 'email']

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['company', 'contact', 'status', 'source', 'score', 'created_at']
    list_filter = ['status', 'source', 'assigned_to']
    search_fields = ['company__name', 'contact__email']

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'stage', 'probability', 'value', 'estimated_close_date']
    list_filter = ['stage', 'probability']
    search_fields = ['name', 'lead__company__name']

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'title', 'status', 'start_date', 'end_date', 'value']
    list_filter = ['status', 'auto_renewal']
    search_fields = ['contract_number', 'title']

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'service_type', 'location', 'rating']
    list_filter = ['service_type', 'certification_level']
    search_fields = ['name', 'service_type']

@admin.register(MarketingCampaign)
class MarketingCampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'start_date', 'end_date', 'budget']
    list_filter = ['status']
    search_fields = ['name', 'description']

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'subject', 'company', 'priority', 'status', 'created_at']
    list_filter = ['priority', 'status', 'assigned_to']
    search_fields = ['ticket_number', 'subject', 'company__name']

@admin.register(RevenueForecast)
class RevenueForecastAdmin(admin.ModelAdmin):
    list_display = ['period', 'forecasted_revenue', 'actual_revenue', 'confidence_level']
    list_filter = ['confidence_level']
    search_fields = ['period']

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'entity_type', 'entity_id', 'timestamp']
    list_filter = ['action', 'entity_type', 'user']
    search_fields = ['action', 'entity_type']
    readonly_fields = ['timestamp']
