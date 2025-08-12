from rest_framework import serializers
from .models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast,
    ActivityLog, AIConversation, LeadNote, LeadHistory
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

class LeadNoteSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = LeadNote
        fields = '__all__'

class LeadHistorySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = LeadHistory
        fields = '__all__'

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return "System"

class LeadSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    contact = ContactSerializer(read_only=True)
    assigned_to = serializers.StringRelatedField(read_only=True)
    lead_notes = LeadNoteSerializer(many=True, read_only=True)
    history_entries = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = '__all__'

    def get_history_entries(self, obj):
        """
        Get history entries, handling case where LeadHistory table doesn't exist yet
        """
        try:
            from .models import LeadHistory
            history_entries = obj.history_entries.all()
            return LeadHistorySerializer(history_entries, many=True).data
        except Exception:
            # Return empty list if LeadHistory table doesn't exist
            return []

    def get_company(self, obj):
        return {
            'id': obj.company.id,
            'name': obj.company.name,
            'industry': obj.company.industry,
            'location': obj.company.location,
        }

    def get_contact(self, obj):
        return {
            'id': obj.contact.id,
            'first_name': obj.contact.first_name,
            'last_name': obj.contact.last_name,
            'email': obj.contact.email,
            'phone': obj.contact.phone,
            'position': obj.contact.position,
        }

    def get_assigned_to(self, obj):
        if obj.assigned_to:
            return {
                'id': obj.assigned_to.id,
                'username': obj.assigned_to.username,
                'first_name': obj.assigned_to.first_name,
                'last_name': obj.assigned_to.last_name,
            }
        return None

    def get_days_since_created(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.created_at).days

class OptimizedLeadSerializer(serializers.ModelSerializer):
    """Optimized serializer for list views with minimal data"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_industry = serializers.CharField(source='company.industry', read_only=True)
    contact_first_name = serializers.CharField(source='contact.first_name', read_only=True)
    contact_last_name = serializers.CharField(source='contact.last_name', read_only=True)
    contact_email = serializers.CharField(source='contact.email', read_only=True)
    contact_phone = serializers.CharField(source='contact.phone', read_only=True)
    contact_position = serializers.CharField(source='contact.position', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    latest_note = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            'id', 'status', 'source', 'priority', 'score', 'estimated_value',
            'notes', 'next_action', 'next_action_date', 'created_at', 'updated_at',
            'company_name', 'company_industry', 'contact_first_name', 'contact_last_name',
            'contact_email', 'contact_phone', 'contact_position', 'assigned_to_username',
            'latest_note'
        ]

    def get_latest_note(self, obj):
        latest_note = obj.lead_notes.first()
        if latest_note:
            return {
                'id': latest_note.id,
                'note': latest_note.note,
                'created_at': latest_note.created_at,
                'created_by': latest_note.created_by.username if latest_note.created_by else None
            }
        return None


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