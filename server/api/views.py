from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from .models import EmailTracking
import urllib.parse
import uuid


from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    Company, Contact, Lead, Opportunity, OpportunityActivity, Contract, ContractBreach,
    CampaignTemplate, EmailCampaign, TravelOffer, SupportTicket,
    RevenueForecast, LeadNote, LeadHistory, ActivityLog, AIConversation, ProposalDraft
)
from .serializers import (
    CompanySerializer, ContactSerializer, LeadSerializer, OpportunitySerializer,
    OpportunityActivitySerializer, ContractSerializer, ContractBreachSerializer,
    CampaignTemplateSerializer, EmailCampaignSerializer, TravelOfferSerializer,
    SupportTicketSerializer, RevenueForecastSerializer, LeadNoteSerializer,
    LeadHistorySerializer, ActivityLogSerializer, AIConversationSerializer, ProposalDraftSerializer
)

# Helper function to create lead history entries
def create_lead_history(lead, history_type, action, details, icon=None, user=None):
    """Creates a LeadHistory entry if the table exists."""
    try:
        LeadHistory.objects.create(
            lead=lead,
            history_type=history_type,
            action=action,
            details=details,
            icon=icon,
            created_by=user,
            timestamp=timezone.now()
        )
    except Exception:
        # Silently handle case where LeadHistory table doesn't exist yet
        pass

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    @action(detail=False, methods=['post'])
    def search(self, request):
        # Extract filters from request body
        filters = request.data
        query = filters.get('q', '')
        industry = filters.get('industry', '')
        size = filters.get('size', '')
        location = filters.get('location', '')
        travel_budget = filters.get('travelBudget', '')
        travel_frequency = filters.get('travelFrequency', '')
        company_size = filters.get('companySize', '')
        global_search = filters.get('globalSearch', '') # Added global search parameter

        # Advanced filters support
        industries = filters.get('industries', [])
        employee_range = filters.get('employeeRange', [])
        revenue_range = filters.get('revenueRange', '')
        credit_rating = filters.get('creditRating', '')
        sustainability_level = filters.get('sustainabilityLevel', '')
        preferred_class = filters.get('preferredClass', '')

        companies = self.queryset.filter(is_active=True)

        # Apply global search filter (company name)
        if global_search:
            companies = companies.filter(name__icontains=global_search)

        if query:
            companies = companies.filter(
                Q(name__icontains=query) |
                Q(location__icontains=query) |
                Q(description__icontains=query)
            )

        if industry:
            companies = companies.filter(industry=industry)

        if size:
            companies = companies.filter(size=size)

        if location:
            # Handle location filtering with different mapping
            location_mapping = {
                'north-america': ['USA', 'United States', 'North America', 'Canada', 'Mexico'],
                'europe': ['Europe', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
                'asia-pacific': ['Asia', 'Asia-Pacific', 'Japan', 'Singapore', 'Australia', 'China', 'India'],
                'global': ['Global', 'Worldwide', 'International'],
                'emerging': ['Brazil', 'India', 'South Africa', 'Eastern Europe']
            }

            if location in location_mapping:
                location_filters = Q()
                for loc in location_mapping[location]:
                    location_filters |= Q(location__icontains=loc)
                companies = companies.filter(location_filters)
            else:
                companies = companies.filter(location__icontains=location)

        # Handle travel budget filtering
        if travel_budget:
            budget_ranges = {
                'under-500k': (0, 500000),
                '500k-1m': (500000, 1000000),
                '1m-3m': (1000000, 3000000),
                '3m-5m': (3000000, 5000000),
                'above-5m': (5000000, float('inf'))
            }

            if travel_budget in budget_ranges:
                min_budget, max_budget = budget_ranges[travel_budget]
                if max_budget == float('inf'):
                    companies = companies.filter(travel_budget__gte=min_budget)
                else:
                    companies = companies.filter(travel_budget__gte=min_budget, travel_budget__lt=max_budget)

        # Handle company size filtering
        if company_size:
            size_mapping = {
                'startup': ['startup'],
                'small': ['small'],
                'medium': ['medium'],
                'large': ['large'],
                'enterprise': ['enterprise']
            }

            if company_size in size_mapping:
                companies = companies.filter(size__in=size_mapping[company_size])

        # Handle multiple industries filter (advanced filter)
        if industries:
            companies = companies.filter(industry__in=industries)

        # Handle employee range filter (advanced filter)
        if employee_range and len(employee_range) == 2:
            min_employees, max_employees = employee_range
            companies = companies.filter(
                employee_count__gte=min_employees,
                employee_count__lte=max_employees
            )

        # Handle revenue range filter (advanced filter)
        if revenue_range:
            revenue_ranges = {
                'under-10m': (0, 10000000),
                '10m-50m': (10000000, 50000000),
                '50m-100m': (50000000, 100000000),
                '100m-500m': (100000000, 500000000),
                'above-500m': (500000000, float('inf'))
            }

            if revenue_range in revenue_ranges:
                min_revenue, max_revenue = revenue_ranges[revenue_range]
                if max_revenue == float('inf'):
                    companies = companies.filter(annual_revenue__gte=min_revenue)
                else:
                    companies = companies.filter(
                        annual_revenue__gte=min_revenue,
                        annual_revenue__lt=max_revenue
                    )

        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = {
            'total_companies': self.queryset.filter(is_active=True).count(),
            'by_industry': dict(self.queryset.values_list('industry').annotate(count=Count('id'))),
            'by_size': dict(self.queryset.values_list('size').annotate(count=Count('id'))),
            'total_revenue': self.queryset.aggregate(total=Sum('annual_revenue'))['total'] or 0,
            'total_employees': self.queryset.aggregate(total=Sum('employee_count'))['total'] or 0,
        }
        return Response(stats)

    @action(detail=False, methods=['post'])
    def check_leads_status(self, request):
        """Check if companies have been moved to leads"""
        company_names = request.data.get('company_names', [])

        if not company_names:
            return Response({'error': 'No company names provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Find companies that exist as leads
        existing_leads = Lead.objects.select_related('company').filter(
            company__name__in=company_names
        ).values_list('company__name', flat=True)

        # Create a mapping of company name to lead status
        lead_status = {}
        for name in company_names:
            lead_status[name] = name in existing_leads

        return Response(lead_status)

    @action(detail=True, methods=['post'])
    def mark_as_moved_to_lead(self, request, pk=None):
        """Mark a company as moved to lead"""
        try:
            company = self.get_object()
            company.move_as_lead = True
            company.save()

            return Response({
                'message': f'{company.name} has been marked as moved to lead',
                'move_as_lead': True
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to mark company as moved to lead: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload companies from Excel/CSV file"""
        import pandas as pd
        import io

        try:
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'No file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            uploaded_file = request.FILES['file']

            # Validate file type
            allowed_extensions = ['.xlsx', '.xls', '.csv']
            file_extension = uploaded_file.name.lower().split('.')[-1]
            if f'.{file_extension}' not in allowed_extensions:
                return Response(
                    {'error': 'Invalid file type. Please upload Excel (.xlsx, .xls) or CSV (.csv) files only.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate file size (10MB limit)
            if uploaded_file.size > 10 * 1024 * 1024:
                return Response(
                    {'error': 'File size exceeds 10MB limit'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Read the file
            try:
                if file_extension == 'csv':
                    df = pd.read_csv(io.BytesIO(uploaded_file.read()))
                else:
                    df = pd.read_excel(io.BytesIO(uploaded_file.read()))
            except Exception as e:
                return Response(
                    {'error': f'Failed to read file: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate required columns
            required_columns = [
                'Company Name', 'Industry', 'Company Size Category', 'Location', 'Email'
            ]

            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return Response(
                    {'error': f'Missing required columns: {", ".join(missing_columns)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process the data
            created_count = 0
            skipped_count = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    # Skip rows with empty required fields
                    if pd.isna(row['Company Name']) or not str(row['Company Name']).strip():
                        skipped_count += 1
                        continue

                    company_name = str(row['Company Name']).strip()

                    # Check if company already exists
                    if Company.objects.filter(name__iexact=company_name).exists():
                        skipped_count += 1
                        continue

                    # Map form fields to model fields
                    company_data = {
                        'name': company_name,
                        'industry': self._map_industry(str(row.get('Industry', '')).strip()),
                        'size': self._map_company_size(str(row.get('Company Size Category', '')).strip()),
                        'location': str(row.get('Location', '')).strip(),
                        'email': str(row.get('Email', '')).strip(),
                        'phone': str(row.get('Phone', '')).strip(),
                        'website': str(row.get('Website', '')).strip(),
                        'company_type': self._map_company_type(str(row.get('Company Type', '')).strip()),
                        'year_established': self._safe_int(row.get('Year Established')),
                        'employee_count': self._safe_int(row.get('Number of Employees')),
                        'annual_revenue': self._safe_decimal(row.get('Annual Revenue (Millions)'), multiplier=1000000),
                        'travel_budget': self._safe_decimal(row.get('Annual Travel Budget (Millions)'), multiplier=1000000),
                        'annual_travel_volume': str(row.get('Annual Travel Volume', '')).strip(),
                        'travel_frequency': self._map_travel_frequency(str(row.get('Travel Frequency', '')).strip()),
                        'preferred_class': self._map_preferred_class(str(row.get('Preferred Class', '')).strip()),
                        'credit_rating': self._map_credit_rating(str(row.get('Credit Rating', '')).strip()),
                        'payment_terms': self._map_payment_terms(str(row.get('Payment Terms', '')).strip()),
                        'sustainability_focus': self._map_sustainability(str(row.get('Sustainability Focus', '')).strip()),
                        'risk_level': self._map_risk_level(str(row.get('Risk Level', '')).strip()),
                        'expansion_plans': self._map_expansion_plans(str(row.get('Expansion Plans', '')).strip()),
                        'specialties': str(row.get('Specialties (comma-separated)', '')).strip(),
                        'technology_integration': str(row.get('Technology Integration (comma-separated)', '')).strip(),
                        'current_airlines': str(row.get('Current Airlines (comma-separated)', '')).strip(),
                        'description': str(row.get('Notes', '')).strip(),
                        'is_active': True
                    }

                    # Remove empty strings and None values
                    company_data = {k: v for k, v in company_data.items() if v not in ['', None, 'nan']}

                    # Create the company
                    Company.objects.create(**company_data)
                    created_count += 1

                except Exception as e:
                    errors.append(f'Row {index + 2}: {str(e)}')
                    continue

            response_data = {
                'success': True,
                'message': f'Upload completed successfully',
                'created_count': created_count,
                'skipped_count': skipped_count,
                'total_rows': len(df)
            }

            if errors:
                response_data['errors'] = errors[:10]  # Limit to first 10 errors
                response_data['total_errors'] = len(errors)

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _map_industry(self, industry):
        """Map industry values to model choices"""
        industry_mapping = {
            'technology': 'technology',
            'tech': 'technology',
            'finance': 'finance',
            'finance & banking': 'finance',
            'banking': 'finance',
            'healthcare': 'healthcare',
            'health': 'healthcare',
            'manufacturing': 'manufacturing',
            'retail': 'retail',
            'consulting': 'consulting',
            'telecommunications': 'telecommunications',
            'telecom': 'telecommunications',
            'energy': 'energy',
            'energy & utilities': 'energy',
            'utilities': 'energy',
            'transportation': 'transportation',
            'education': 'education',
            'government': 'government',
            'other': 'other'
        }
        return industry_mapping.get(industry.lower(), 'other')

    def _map_company_size(self, size):
        """Map company size values to model choices"""
        size_mapping = {
            'startup': 'startup',
            'startup (1-50)': 'startup',
            'small': 'small',
            'small (51-200)': 'small',
            'medium': 'medium',
            'medium (201-1000)': 'medium',
            'large': 'large',
            'large (1001-5000)': 'large',
            'enterprise': 'enterprise',
            'enterprise (5000+)': 'enterprise'
        }
        return size_mapping.get(size.lower(), 'medium')

    def _map_company_type(self, company_type):
        """Map company type values to model choices"""
        type_mapping = {
            'corporation': 'corporation',
            'llc': 'llc',
            'partnership': 'partnership',
            'nonprofit': 'nonprofit',
            'non-profit': 'nonprofit'
        }
        return type_mapping.get(company_type.lower(), 'corporation')

    def _map_travel_frequency(self, frequency):
        """Map travel frequency values to model choices"""
        frequency_mapping = {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'monthly': 'Monthly',
            'quarterly': 'Quarterly',
            'bi-weekly': 'Bi-weekly'
        }
        return frequency_mapping.get(frequency.lower(), '')

    def _map_preferred_class(self, pref_class):
        """Map preferred class values to model choices"""
        class_mapping = {
            'economy': 'Economy',
            'economy plus': 'Economy Plus',
            'business': 'Business',
            'first': 'First',
            'first class': 'First',
            'business/first': 'Business/First'
        }
        return class_mapping.get(pref_class.lower(), '')

    def _map_credit_rating(self, rating):
        """Map credit rating values to model choices"""
        rating_mapping = {
            'aaa': 'AAA',
            'aa': 'AA',
            'a': 'A',
            'bbb': 'BBB',
            'bb': 'BB'
        }
        return rating_mapping.get(rating.lower(), '')

    def _map_payment_terms(self, terms):
        """Map payment terms values to model choices"""
        terms_mapping = {
            'net 15': 'Net 15',
            'net 30': 'Net 30',
            'net 45': 'Net 45',
            'net 60': 'Net 60'
        }
        return terms_mapping.get(terms.lower(), '')

    def _map_sustainability(self, sustainability):
        """Map sustainability values to model choices"""
        sustainability_mapping = {
            'very high': 'Very High',
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        }
        return sustainability_mapping.get(sustainability.lower(), '')

    def _map_risk_level(self, risk):
        """Map risk level values to model choices"""
        risk_mapping = {
            'very low': 'Very Low',
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High'
        }
        return risk_mapping.get(risk.lower(), '')

    def _map_expansion_plans(self, plans):
        """Map expansion plans values to model choices"""
        plans_mapping = {
            'aggressive': 'Aggressive',
            'moderate': 'Moderate',
            'conservative': 'Conservative',
            'rapid': 'Rapid',
            'stable': 'Stable'
        }
        return plans_mapping.get(plans.lower(), '')

    def _safe_int(self, value):
        """Safely convert value to integer"""
        if pd.isna(value) or value == '':
            return None
        try:
            return int(float(value))
        except (ValueError, TypeError):
            return None

    def _safe_decimal(self, value, multiplier=1):
        """Safely convert value to decimal with optional multiplier"""
        if pd.isna(value) or value == '':
            return None
        try:
            return float(value) * multiplier
        except (ValueError, TypeError):
            return None

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @action(detail=False, methods=['get'])
    def decision_makers(self, request):
        contacts = self.queryset.filter(is_decision_maker=True)
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.select_related('company', 'contact', 'assigned_to').all()
    serializer_class = LeadSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        # Extract company and contact data
        company_data = data.get('company', {})
        contact_data = data.get('contact', {})

        try:
            # Create or get company
            company, created = Company.objects.get_or_create(
                name=company_data.get('name'),
                defaults={
                    'industry': company_data.get('industry', ''),
                    'location': company_data.get('location', ''),
                    'size': company_data.get('size', ''),
                    'annual_revenue': company_data.get('annual_revenue'),
                    'travel_budget': company_data.get('travel_budget'),
                    'is_active': True
                }
            )

            # Create contact
            contact = Contact.objects.create(
                company=company,
                first_name=contact_data.get('first_name'),
                last_name=contact_data.get('last_name'),
                email=contact_data.get('email'),
                phone=contact_data.get('phone', ''),
                position=contact_data.get('position', ''),
                is_decision_maker=contact_data.get('is_decision_maker', False)
            )

            # Create the lead
            lead = Lead.objects.create(
                company=company,
                contact=contact,
                status=data.get('status', 'new'),
                source=data.get('source'),
                priority=data.get('priority', 'medium'),
                score=data.get('score', 0),
                estimated_value=data.get('estimated_value'),
                notes=data.get('notes', ''),
                next_action=data.get('next_action', ''),
                next_action_date=data.get('next_action_date')
            )

            # Mark company as moved to lead
            company.move_as_lead = True
            company.save()

            # Create initial history entry
            create_lead_history(
                lead=lead,
                history_type='creation',
                action='Lead created',
                details=f"Lead created from {lead.source}. Initial contact information collected for {lead.company.name}.",
                icon='plus',
                user=self.request.user if self.request.user.is_authenticated else None
            )

            # Serialize and return the created lead
            serializer = self.get_serializer(lead)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        """Create lead and initial history entry"""
        lead = serializer.save()

        # Create initial history entry
        try:
            LeadHistory.objects.create(
                lead=lead,
                history_type='creation',
                action='Lead created',
                details=f'Lead created from {lead.source} source. Initial contact information collected for {lead.company.name}.',
                icon='plus',
                user=self.request.user if self.request.user.is_authenticated else None
            )
        except Exception as e:
            print(f"Error creating initial lead history: {e}")


    def get_queryset(self):
        queryset = self.queryset
        status = self.request.query_params.get('status', None)
        industry = self.request.query_params.get('industry', None)
        score = self.request.query_params.get('score', None)
        search = self.request.query_params.get('search', None)

        if status and status != 'all':
            queryset = queryset.filter(status=status)

        if industry and industry != 'all':
            queryset = queryset.filter(company__industry=industry)

        if score and score != 'all':
            if score == 'high':
                queryset = queryset.filter(score__gte=70)
            elif score == 'medium':
                queryset = queryset.filter(score__gte=40, score__lt=70)
            elif score == 'low':
                queryset = queryset.filter(score__lt=40)

        if search:
            queryset = queryset.filter(
                Q(company__name__icontains=search) |
                Q(contact__first_name__icontains=search) |
                Q(contact__last_name__icontains=search) |
                Q(contact__email__icontains=search)
            )

        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def pipeline_stats(self, request):
        stats = {}
        total_leads = self.queryset.count()

        for status, status_label in Lead.LEAD_STATUS_CHOICES:
            count = self.queryset.filter(status=status).count()
            stats[status] = {
                'count': count,
                'label': status_label,
                'percentage': (count / total_leads * 100) if total_leads > 0 else 0
            }

        stats['summary'] = {
            'total_leads': total_leads,
            'qualified_leads': self.queryset.filter(status='qualified').count(),
            'unqualified_leads': self.queryset.filter(status='unqualified').count(),
            'active_leads': self.queryset.filter(status__in=['new', 'contacted', 'qualified']).count(),
            'conversion_rate': (self.queryset.filter(status='won').count() / max(Lead.objects.count(), 1)) if total_leads > 0 else 0
        }

        return Response(stats)

    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Optimized POST endpoint for searching leads with filters
        """
        try:
            filters = request.data if hasattr(request, 'data') else {}

            search_term = filters.get('search', '')
            status_filter = filters.get('status', '')
            industry_filter = filters.get('industry', '')
            score = filters.get('score', '')
            engagement = filters.get('engagement', '')

            # Get all leads with proper eager loading, excluding those converted to opportunities
            leads = Lead.objects.select_related('company', 'contact', 'assigned_to').all()

            # Apply filters if provided
            if status_filter and status_filter != 'all':
                leads = leads.filter(status=status_filter)

            if industry_filter and industry_filter != 'all':
                leads = leads.filter(company__industry=industry_filter)

            if search_term:
                leads = leads.filter(
                    Q(company__name__icontains=search_term) |
                    Q(contact__first_name__icontains=search_term) |
                    Q(contact__last_name__icontains=search_term)
                )

            if score and score != 'all':
                if score == 'high':
                    leads = leads.filter(score__gte=80)
                elif score == 'medium':
                    leads = leads.filter(score__gte=60, score__lt=80)
                elif score == 'low':
                    leads = leads.filter(score__lt=60)

            # Add engagement filter logic if needed
            if engagement and engagement != 'all':
                if engagement == 'High':
                    leads = leads.filter(score__gte=80)
                elif engagement == 'Medium':
                    leads = leads.filter(score__gte=60, score__lt=80)
                elif engagement == 'Low':
                    leads = leads.filter(score__lt=60)

            # Order and limit for performance
            leads = leads.order_by('-created_at')[:100]  # Limit to 100 results for performance

            # Use standard serializer since OptimizedLeadSerializer might not exist
            serializer = self.get_serializer(leads, many=True)
            return Response(serializer.data)

        except Exception as e:
            print(f"Error in leads search: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Search failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def qualified_leads(self, request):
        leads = self.queryset.filter(status='qualified').order_by('-score', '-created_at')
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unqualified_leads(self, request):
        leads = self.queryset.filter(status='unqualified').order_by('-created_at')
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        lead = self.get_object()
        score = request.data.get('score', 0)
        old_score = lead.score
        lead.score = score
        lead.save()

        # Create history entry for score update
        create_lead_history(
            lead=lead,
            history_type='score_update',
            action=f'Lead score updated to {lead.score}',
            details=f'Lead score updated from {old_score} to {lead.score} based on engagement metrics and profile analysis.',
            icon='trending-up',
            user=request.user if request.user.is_authenticated else None
        )

        return Response({'status': 'score updated', 'new_score': lead.score})

    @action(detail=True, methods=['post'])
    def qualify(self, request, pk=None):
        try:
            lead = self.get_object()
            old_status = lead.status
            lead.status = 'qualified'
            lead.save()

            # Create history entry for status change
            create_lead_history(
                lead=lead,
                history_type='qualification',
                action=f'Lead qualified',
                details=self._get_status_change_details(old_status, lead.status, lead),
                icon=self._get_status_icon(lead.status),
                user=request.user if request.user.is_authenticated else None
            )

            return Response({'status': 'lead qualified'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def disqualify(self, request, pk=None):
        try:
            lead = self.get_object()

            # Handle different request data formats
            if hasattr(request, 'data') and request.data:
                if isinstance(request.data, dict):
                    reason = request.data.get('reason', '')
                    created_by = request.data.get('created_by', '')
                else:
                    # If request.data is a string, try to extract reason
                    reason = str(request.data) if request.data else ''
                    created_by = ''
            else:
                reason = ''
                created_by = ''

            old_status = lead.status

            lead.status = 'unqualified'
            # Append disqualification reason to notes
            timestamp = timezone.now().strftime('%Y-%m-%d %H:%M')
            disqualify_note = f"[{timestamp}] Disqualified: {reason}" if reason else f"[{timestamp}] Disqualified"

            if lead.notes:
                lead.notes = f"{lead.notes}\n\n{disqualify_note}"
            else:
                lead.notes = disqualify_note

            lead.save()

            # Create history entry for disqualification
            create_lead_history(
                lead=lead,
                history_type='disqualification',
                action='Lead disqualified',
                details=f'Lead disqualified. Reason: {reason}' if reason else 'Lead disqualified.',
                icon='x-circle',
                user=request.user if request.user.is_authenticated else None
            )

            # Create history entry for status change
            create_lead_history(
                lead=lead,
                history_type='status_change',
                action=f'Status changed from {old_status} to {lead.status}',
                details=self._get_status_change_details(old_status, lead.status, lead),
                icon=self._get_status_icon(lead.status),
                user=request.user if request.user.is_authenticated else None
            )

            return Response({'message': 'Lead disqualified successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Disqualify error: {str(e)}")
            print(f"Request data: {request.data}")
            print(f"Request data type: {type(request.data)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def notes(self, request, pk=None):
        """
        Get all notes for a specific lead
        """
        try:
            lead = self.get_object()
            notes = lead.lead_notes.all().order_by('-created_at')
            serializer = LeadNoteSerializer(notes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch notes: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """
        Add a note to a lead
        """
        lead = self.get_object()
        note_text = request.data.get('note', '')
        next_action = request.data.get('nextAction', '')
        urgency = request.data.get('urgency', 'Medium')

        if not note_text:
            return Response({'error': 'Note text is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the note
            note = LeadNote.objects.create(
                lead=lead,
                note=note_text,
                next_action=next_action,
                urgency=urgency
            )

            # Update lead's next action if provided
            if next_action:
                lead.next_action = next_action
                lead.save()

            # Create history entry
            create_lead_history(
                lead=lead,
                history_type='note_added',
                action=f'Note added: {note_text[:50]}{"..." if len(note_text) > 50 else ""}',
                details=f'Note: {note_text}\nNext Action: {next_action}\nUrgency: {urgency}',
                user=request.user if request.user.is_authenticated else None,
                icon='message-square'
            )

            # Serialize the note and updated lead
            note_serializer = LeadNoteSerializer(note)
            lead_serializer = LeadSerializer(lead)

            return Response({
                'message': 'Note added successfully',
                'note': note_serializer.data,
                'lead': lead_serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f'Failed to add note: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """Handle opportunity updates with proper validation"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print(f"Validation errors: {serializer.errors}")
                return Response(
                    {'error': 'Validation failed', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Error updating opportunity: {str(e)}")
            return Response(
                {'error': f'Update failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _get_status_change_details(self, old_status, new_status, lead):
        """Get detailed description for status changes"""
        details_map = {
            'contacted': f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
            'responded': f'{lead.contact.first_name} responded to initial outreach. Expressed interest in travel solutions.',
            'qualified': f'Lead qualified based on budget ({f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else "TBD"}), authority, and timeline. Ready for proposal stage.',
            'unqualified': 'Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.',
            'proposal_sent': 'Proposal sent to prospect. Awaiting response and feedback.',
            'negotiation': 'Entered negotiation phase. Discussing terms and pricing.',
            'won': 'Lead successfully converted to customer. Deal closed!',
            'lost': 'Lead was lost to competitor or decided not to proceed.'
        }
        return details_map.get(new_status, f'Status updated from {old_status} to {new_status}.')

    def _get_status_icon(self, status):
        """Get appropriate icon for status"""
        icon_map = {
            'contacted': 'mail',
            'responded': 'message-circle',
            'qualified': 'check-circle',
            'unqualified': 'x-circle',
            'proposal_sent': 'file-text',
            'negotiation': 'handshake',
            'won': 'trophy',
            'lost': 'x'
        }
        return icon_map.get(status, 'plus')

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get history for a specific lead"""
        try:
            lead = self.get_object()
            history_entries = lead.history_entries.all().order_by('timestamp')

            # If no history entries exist, create comprehensive history
            if not history_entries.exists():
                try:
                    current_time = lead.created_at

                    # 1. Lead creation
                    LeadHistory.objects.create(
                        lead=lead,
                        history_type='creation',
                        action='Lead created',
                        details=f'Lead created from {lead.source} source. Initial contact information collected for {lead.company.name}.',
                        icon='plus',
                        user=None,
                        timestamp=current_time
                    )

                    # 2. Parse agent assignments from notes if they exist
                    if lead.notes and '[Agent Assignment' in lead.notes:
                        import re
                        # Extract agent assignments from notes
                        agent_assignments = re.findall(r'\[Agent Assignment - ([^\]]+)\]\s*Assigned to: ([^\n]+)\s*Priority: ([^\n]+)(?:\s*Assignment Notes: ([^\n]+))?', lead.notes)

                        for idx, (date_str, agent_name, priority, assignment_notes) in enumerate(agent_assignments):
                            try:
                                # Parse the date
                                import datetime
                                assignment_time = datetime.datetime.strptime(date_str, '%Y-%m-%d %H:%M')
                                assignment_time = timezone.make_aware(assignment_time)
                            except:
                                assignment_time = current_time + timedelta(hours=idx + 1)

                            history_type = 'agent_reassignment' if idx > 0 else 'agent_assignment'
                            action = f'Agent {"reassigned" if idx > 0 else "assigned"} to {agent_name}'
                            details = f'Lead {"reassigned" if idx > 0 else "assigned"} to {agent_name} with {priority.lower()}.'
                            if assignment_notes:
                                details += f' Assignment notes: {assignment_notes}'

                            LeadHistory.objects.create(
                                lead=lead,
                                history_type=history_type,
                                action=action,
                                details=details,
                                icon='user',
                                user=lead.assigned_to,
                                timestamp=assignment_time
                            )

                    # 3. Agent assignment (if assigned and not already processed from notes)
                    elif lead.assigned_agent or lead.assigned_to:
                        current_time += timedelta(hours=1)
                        agent_name = lead.assigned_agent or (f"{lead.assigned_to.first_name} {lead.assigned_to.last_name}".strip() if lead.assigned_to else "Unknown Agent")
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='agent_assignment',
                            action=f'Lead assigned to {agent_name}',
                            details=f'Lead assigned to {agent_name} for follow-up and qualification.',
                            icon='user',
                            user=lead.assigned_to,
                            timestamp=current_time
                        )

                    # 4. Status-specific entries
                    if lead.status == 'contacted':
                        current_time += timedelta(hours=2)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='contact_made',
                            action='Initial contact made',
                            details=f'Initial contact made with {lead.contact.first_name}. Email sent introducing our travel solutions.',
                            icon='mail',
                            user=lead.assigned_to,
                            timestamp=current_time
                        )

                        # Add call entry
                        current_time += timedelta(hours=3)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='call_made',
                            action='Discovery call completed',
                            details=f'30-minute discovery call with {lead.contact.first_name}. Discussed travel requirements and current pain points.',
                            icon='phone',
                            user=lead.assigned_to,
                            timestamp=current_time
                        )

                    elif lead.status == 'qualified':
                        current_time += timedelta(days=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='qualification',
                            action='Lead qualified',
                            details=f'Lead qualified based on budget ({f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else "TBD"}), authority, and timeline. Ready for proposal stage.',
                            icon='check-circle',
                            user=lead.assigned_to,
                            timestamp=current_time
                        )

                    elif lead.status == 'unqualified':
                        current_time += timedelta(days=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='disqualification',
                            action='Lead disqualified',
                            details='Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.',
                            icon='x-circle',
                            user=lead.assigned_to,
                            timestamp=current_time
                        )

                    # 5. Add notes from lead_notes (excluding agent assignment entries)
                    for note in lead.lead_notes.all()[:3]:  # Latest 3 notes
                        current_time += timedelta(hours=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='note_added',
                            action=f'Note added: "{note.note[:30]}..."',
                            details=f'Note: {note.note}. Next action: {note.next_action or "None"}. Urgency: {note.urgency or "Medium"}.',
                            icon='message-square',
                            user=note.created_by,
                            timestamp=current_time
                        )

                    # 6. Score update (if score > 50)
                    if lead.score > 50:
                        current_time += timedelta(hours=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='score_update',
                            action=f'Lead score updated to {lead.score}',
                            details=f'Lead score updated to {lead.score} based on engagement metrics and profile analysis.',
                            icon='trending-up',
                            user=None,
                            timestamp=current_time
                        )

                    # Fetch again after creation
                    history_entries = lead.history_entries.all().order_by('timestamp')
                except Exception as create_error:
                    print(f"Error creating initial history: {create_error}")

            serializer = LeadHistorySerializer(history_entries, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"History fetch error: {e}")
            # If LeadHistory table doesn't exist, return empty list
            return Response([])

    @action(detail=True, methods=['post'])
    def move_to_opportunity(self, request, pk=None):
        """Move a qualified lead to opportunities"""
        try:
            lead = self.get_object()

            # Check if lead is qualified
            if lead.status != 'qualified':
                return Response(
                    {'error': 'Only qualified leads can be moved to opportunities'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if opportunity already exists for this lead
            if hasattr(lead, 'opportunity'):
                return Response(
                    {'error': 'This lead already has an associated opportunity'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get opportunity data from request
            opportunity_data = request.data.get('opportunity', {})

            # Create the opportunity
            opportunity = Opportunity.objects.create(
                lead=lead,
                name=opportunity_data.get('name', f"{lead.company.name} - Corporate Travel Solution"),
                stage=opportunity_data.get('stage', 'discovery'),
                probability=opportunity_data.get('probability', 65),
                estimated_close_date=opportunity_data.get('estimatedCloseDate',
                    (timezone.now().date() + timedelta(days=30))),
                value=opportunity_data.get('dealValue', lead.estimated_value or 250000),
                description=opportunity_data.get('notes', f"Opportunity created from qualified lead. {lead.notes}"),
                next_steps=opportunity_data.get('nextAction', 'Send initial proposal and schedule presentation')
            )

            # Update lead status to indicate it's been converted
            old_status = lead.status
            lead.status = 'won'  # Mark as won since it moved to opportunity
            lead.save()

            # Create history entry for the conversion
            create_lead_history(
                lead=lead,
                history_type='opportunity_created',
                action='Lead converted to opportunity',
                details=f'Lead successfully converted to sales opportunity: {opportunity.name}. Deal value: ${opportunity.value:,.0f}',
                icon='briefcase',
                user=request.user if request.user.is_authenticated else None
            )

            # Serialize the created opportunity
            opportunity_serializer = OpportunitySerializer(opportunity)

            return Response({
                'message': f'{lead.company.name} has been successfully moved to opportunities',
                'opportunity': opportunity_serializer.data,
                'lead_id': lead.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Failed to move lead to opportunity: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def create_lead_from_company(self, request):
        """Create a lead from corporate search data"""
        try:
            data = request.data
            company_data = data.get('company', {})

            # Extract company information - prioritize top-level name if company.name is missing
            company_name = company_data.get('name') or data.get('name')
            if not company_name:
                return Response({'error': 'Company name is required'}, status=status.HTTP_400_BAD_REQUEST)

            company_data_to_save = {
                'name': company_name,
                'industry': company_data.get('industry', 'other'),
                'location': company_data.get('location', ''),
                'size': company_data.get('size', 'medium'),
                'annual_revenue': company_data.get('annual_revenue'),
                'travel_budget': company_data.get('travel_budget'),
                'employee_count': company_data.get('employee_count'),
                'email': company_data.get('email', ''),
                'phone': company_data.get('phone', ''),
                'description': data.get('notes', '')
            }

            # Create or get company
            company, created = Company.objects.get_or_create(
                name=company_name,
                defaults=company_data_to_save
            )

            # Create default contact
            contact, contact_created = Contact.objects.get_or_create(
                company=company,
                email=company_data.get('email', f"contact@{company_name.lower().replace(' ', '')}.com"),
                defaults={
                    'first_name': company_name.split(' ')[0],
                    'last_name': company_name.split(' ')[-1] if len(company_name.split(' ')) > 1 else '',
                    'phone': company_data.get('phone', ''),
                    'position': 'Decision Maker',
                    'is_decision_maker': True
                }
            )

            # Create the lead
            lead = Lead.objects.create(
                company=company,
                contact=contact,
                status='new',
                source='manual_entry',
                priority='medium',
                score=50,  # Default score
                estimated_value=company_data_to_save.get('travel_budget'),
                notes=f"Lead created from company entry. {data.get('notes', '')}",
                next_action='Initial outreach and qualification'
            )

            # Create initial history entry
            create_lead_history(
                lead=lead,
                history_type='lead_created',
                action='Lead created from company data',
                details=f"Lead created from manual company entry. Company: {company.name}. Initial contact information collected.",
                icon='plus',
                user=request.user if request.user.is_authenticated else None
            )

            # Serialize and return the created lead
            serializer = LeadSerializer(lead)
            return Response({
                'lead': serializer.data,
                'message': f'{company.name} has been successfully added as a lead'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign_agent(self, request, pk=None):
        """Assign or reassign an agent to a lead"""
        try:
            lead = self.get_object()
            # Handle both 'agent_name' and 'agent' field names for compatibility
            agent_name = request.data.get('agent_name') or request.data.get('agent')
            priority = request.data.get('priority', 'Medium Priority')
            assignment_notes = request.data.get('notes', '')

            if not agent_name:
                return Response(
                    {'error': 'Agent name is required (use agent_name or agent field)'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Store previous agent for history
            previous_agent = lead.assigned_agent

            # Update lead with assignment info
            lead.assigned_agent = agent_name

            # Update priority based on assignment priority
            priority_mapping = {
                'Low Priority': 'low',
                'Medium Priority': 'medium',
                'High Priority': 'high',
                'Urgent': 'urgent'
            }
            lead.priority = priority_mapping.get(priority, 'medium')
            lead.save()

            # Create history entry for agent assignment
            if previous_agent and previous_agent != agent_name:
                history_type = 'agent_reassignment'
                action_text = f'Agent reassigned from {previous_agent} to {agent_name}'
                details = f'Lead reassigned from {previous_agent} to {agent_name} with {priority.lower()}.'
            else:
                history_type = 'agent_assignment'
                action_text = f'Agent assigned: {agent_name}'
                details = f'Lead assigned to {agent_name} with {priority.lower()}.'

            if assignment_notes:
                details += f' Assignment notes: {assignment_notes}'

            # Create the history entry with agent metadata
            try:
                from .models import LeadHistory
                LeadHistory.objects.create(
                    lead=lead,
                    history_type=history_type,
                    action=action_text,
                    details=details,
                    icon='user',
                    metadata={
                        'agent_name': agent_name,
                        'previous_agent': previous_agent,
                        'priority': priority,
                        'assignment_notes': assignment_notes
                    },
                    user=request.user if request.user.is_authenticated else None
                )
            except Exception as e:
                print(f"Error creating lead history: {e}")

            # Clean up old assignment notes from the lead notes field
            if lead.notes:
                import re
                # Remove old agent assignment entries from notes
                lead.notes = re.sub(r'\[Agent Assignment[^\]]*\][^\n]*\n?', '', lead.notes)
                lead.save()

            # Return updated lead
            serializer = LeadSerializer(lead)
            return Response({
                'message': f'Lead successfully assigned to {agent_name}',
                'lead': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Failed to assign agent: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send message via email to lead contact and update lead status"""
        try:
            lead = self.get_object()
            method = request.data.get('method', 'Email')
            subject = request.data.get('subject', '')
            message = request.data.get('message', '')
            follow_up_date = request.data.get('followUpDate', '')
            follow_up_mode = request.data.get('followUpMode', '')

            if not subject or not message:
                return Response(
                    {'error': 'Subject and message are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not lead.contact.email:
                return Response(
                    {'error': 'Lead contact does not have an email address'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Send email via SMTP if method is Email
            if method == 'Email':
                from django.core.mail import EmailMessage
                from django.conf import settings

                try:
                    # Create email message
                    email = EmailMessage(
                        subject=subject,
                        body=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[lead.contact.email],
                        bcc=['nagendran.g@infinitisoftware.net','muniraj@infinitisoftware.net'],
                    )

                    # Send the email
                    email.send(fail_silently=False)

                    # Update lead status to 'contacted' if it was 'new'
                    old_status = lead.status
                    if lead.status == 'new':
                        lead.status = 'contacted'
                        lead.save()

                    # Create history entry for contact made
                    create_lead_history(
                        lead=lead,
                        history_type='contact_made',
                        action=f'Email sent: "{subject}"',
                        details=f'Email sent to {lead.contact.email}. Subject: {subject}. Follow-up scheduled for {follow_up_date or "not specified"}.',
                        icon='mail',
                        user=request.user if request.user.is_authenticated else None
                    )

                    # Create history entry for status change if applicable
                    if old_status != lead.status:
                        create_lead_history(
                            lead=lead,
                            history_type='status_change',
                            action=f'Status changed to {lead.get_status_display()}',
                            details=f'Lead status updated from {old_status} to {lead.status} after email contact.',
                            icon='mail',
                            user=request.user if request.user.is_authenticated else None
                        )

                    return Response({
                        'success': True,
                        'message': f'Email sent successfully to {lead.contact.email}',
                        'lead_status': lead.status
                    }, status=status.HTTP_200_OK)

                except Exception as email_error:
                    return Response({
                        'success': False,
                        'error': f'Failed to send email: {str(email_error)}'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                # For non-email methods, just create a history entry
                create_lead_history(
                    lead=lead,
                    history_type='contact_made',
                    action=f'{method} contact made',
                    details=f'{method} contact made with {lead.contact.first_name}. Message: {message[:100]}...',
                    icon='message-circle',
                    user=request.user if request.user.is_authenticated else None
                )

                return Response({
                    'success': True,
                    'message': f'{method} message logged successfully',
                    'lead_status': lead.status
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Failed to send message: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.prefetch_related('activities').all()
    serializer_class = OpportunitySerializer

    def update(self, request, *args, **kwargs):
        """Handle opportunity updates with proper validation"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print(f"Validation errors: {serializer.errors}")
                return Response(
                    {'error': 'Validation failed', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Error updating opportunity: {str(e)}")
            return Response(
                {'error': f'Update failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def add_activity(self, request, pk=None):
        """Add activity to opportunity"""
        try:
            opportunity = self.get_object()

            activity_data = {
                'opportunity': opportunity.id,
                'type': request.data.get('type', 'call'),
                'description': request.data.get('description', ''),
                'date': request.data.get('date', timezone.now().date()),
            }

            activity_serializer = OpportunityActivitySerializer(data=activity_data)
            if activity_serializer.is_valid():
                # Save with user information
                activity = activity_serializer.save(
                    created_by=request.user if request.user.is_authenticated else None
                )

                # Return the activity with updated serializer data including user info
                response_data = OpportunityActivitySerializer(activity).data

                return Response({
                    'message': f'Activity added to {opportunity.name}',
                    'activity': response_data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'error': 'Invalid activity data',
                    'details': activity_serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error adding activity: {str(e)}")
            return Response({
                'error': f'Failed to add activity: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for opportunity"""
        try:
            opportunity = self.get_object()
            activities = opportunity.activities.all()
            serializer = OpportunityActivitySerializer(activities, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': f'Failed to fetch activities: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get comprehensive history for opportunity including lead history"""
        try:
            opportunity = self.get_object()

            # Get opportunity activities
            activities = opportunity.activities.all().order_by('-created_at')
            history_items = []

            # Format activities as history items
            for activity in activities:
                try:
                    # Handle created_by user safely
                    user_name = 'System'
                    if activity.created_by:
                        user_name = f"{activity.created_by.first_name} {activity.created_by.last_name}".strip()
                        if not user_name:
                            user_name = activity.created_by.username

                    # Format timestamp safely
                    formatted_timestamp = 'Recently'
                    if activity.created_at:
                        try:
                            formatted_timestamp = activity.created_at.strftime('%B %d, %Y at %I:%M %p')
                        except:
                            formatted_timestamp = str(activity.created_at)

                    history_items.append({
                        'id': f"opportunity_activity_{activity.id}",
                        'history_type': activity.type,
                        'action': activity.type.replace('_', ' ').title(),
                        'details': activity.description,
                        'icon': 'activity',
                        'timestamp': activity.created_at.isoformat() if activity.created_at else '',
                        'user_name': user_name,
                        'user_role': 'Sales Representative',
                        'formatted_timestamp': formatted_timestamp,
                        'metadata': {'activity_type': activity.type, 'activity_date': str(activity.date)}
                    })
                except Exception as activity_error:
                    print(f"Error processing activity {activity.id}: {activity_error}")
                    continue

            # If opportunity is linked to a lead, get lead history
            if hasattr(opportunity, 'lead') and opportunity.lead:
                try:
                    lead_history = LeadHistory.objects.filter(lead=opportunity.lead).order_by('-timestamp')
                    for history in lead_history:
                        try:
                            # Handle user safely
                            user_name = 'System'
                            user_role = 'System'
                            if history.user:
                                user_name = f"{history.user.first_name} {history.user.last_name}".strip()
                                if not user_name:
                                    user_name = history.user.username
                                user_role = 'Sales Manager' if history.user.is_staff else 'Sales Representative'

                            # Handle metadata safely
                            metadata = {}
                            if hasattr(history, 'metadata') and history.metadata:
                                metadata = history.metadata

                            # Format timestamp
                            formatted_timestamp = 'Recently'
                            if history.timestamp:
                                try:
                                    formatted_timestamp = history.timestamp.strftime('%B %d, %Y at %I:%M %p')
                                except:
                                    formatted_timestamp = str(history.timestamp)

                            history_items.append({
                                'id': f"lead_history_{history.id}",
                                'history_type': history.history_type,
                                'action': history.action,
                                'details': history.details,
                                'icon': history.icon,
                                'timestamp': history.timestamp.isoformat() if history.timestamp else '',
                                'user_name': user_name,
                                'user_role': user_role,
                                'formatted_timestamp': formatted_timestamp,
                                'metadata': metadata
                            })
                        except Exception as history_error:
                            print(f"Error processing lead history {history.id}: {history_error}")
                            continue
                except Exception as lead_history_error:
                    print(f"Error fetching lead history: {lead_history_error}")

            # Sort by timestamp (newest first)
            history_items.sort(key=lambda x: x['timestamp'] if x['timestamp'] else '', reverse=True)

            return Response(history_items)

        except Exception as e:
            print(f"Error in opportunity history endpoint: {str(e)}")
            return Response({
                'error': f'Failed to fetch opportunity history: {str(e)}',
                'history': []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def pipeline_value(self, request):
        pipeline = {}
        total_value = 0
        total_weighted_value = 0

        for stage, stage_label in Opportunity.OPPORTUNITY_STAGES:
            opportunities = self.queryset.filter(stage=stage)
            stage_value = sum(float(opp.value) for opp in opportunities)
            weighted_value = sum(float(opp.value) * (opp.probability / 100) for opp in opportunities)

            pipeline[stage] = {
                'count': opportunities.count(),
                'label': stage_label,
                'total_value': stage_value,
                'weighted_value': weighted_value
            }

            total_value += stage_value
            total_weighted_value += weighted_value

        pipeline['summary'] = {
            'total_opportunities': self.queryset.count(),
            'total_value': total_value,
            'total_weighted_value': total_weighted_value,
            'average_deal_size': total_value / self.queryset.count() if self.queryset.count() > 0 else 0
        }

        return Response(pipeline)

    @action(detail=False, methods=['get'])
    def closing_soon(self, request):
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date() + timedelta(days=days)

        opportunities = self.queryset.filter(
            estimated_close_date__lte=end_date,
            stage__in=['proposal', 'negotiation']
        ).order_by('estimated_close_date')

        serializer = self.get_serializer(opportunities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Search opportunities with filters and pagination
        """
        filters = request.data

        queryset = self.queryset.select_related(
            'lead__company', 'lead__contact'
        )

        search = filters.get('search', '')
        stage = filters.get('stage', '')
        owner = filters.get('owner', '')
        industry = filters.get('industry', '')
        limit = int(filters.get('limit', 100))  # Default limit of 100
        page = int(filters.get('page', 1))

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(lead__company__name__icontains=search) |
                Q(lead__contact__first_name__icontains=search) |
                Q(lead__contact__last_name__icontains=search)
            )

        if stage and stage != 'all':
            queryset = queryset.filter(stage=stage)

        if industry and industry != 'all':
            queryset = queryset.filter(lead__company__industry=industry)

        # Order by probability and value for better prioritization
        queryset = queryset.order_by('-probability', '-value')

        # Apply pagination
        offset = (page - 1) * limit
        queryset = queryset[offset:offset + limit]

        # Use optimized serializer for faster response
        from .serializers import OptimizedOpportunitySerializer
        serializer = OptimizedOpportunitySerializer(queryset, many=True)
        return Response(serializer.data)

class OpportunityActivityViewSet(viewsets.ModelViewSet):
    queryset = OpportunityActivity.objects.all()
    serializer_class = OpportunityActivitySerializer

    def get_queryset(self):
        queryset = self.queryset
        opportunity_id = self.request.query_params.get('opportunity_id', None)

        if opportunity_id:
            queryset = queryset.filter(opportunity_id=opportunity_id)

        return queryset.order_by('-date', '-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    @action(detail=False, methods=['get'])
    def renewal_alerts(self, request):
        days_ahead = int(request.query_params.get('days', 30))
        alert_date = timezone.now().date() + timedelta(days=days_ahead)

        contracts = self.queryset.filter(
            end_date__lte=alert_date,
            status='active'
        ).order_by('end_date')

        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def at_risk(self, request):
        contracts = self.queryset.filter(
            Q(status='at_risk') | Q(risk_score__gte=7)
        ).order_by('-risk_score')

        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_contracts = self.queryset.count()
        active_contracts = self.queryset.filter(status='active').count()
        expiring_soon = self.queryset.filter(
            end_date__lte=timezone.now().date() + timedelta(days=30),
            status='active'
        ).count()

        stats = {
            'total_contracts': total_contracts,
            'active_contracts': active_contracts,
            'expiring_soon': expiring_soon,
            'total_value': self.queryset.aggregate(total=Sum('value'))['total'] or 0,
            'average_value': self.queryset.aggregate(avg=Avg('value'))['avg'] or 0,
            'breach_count': ContractBreach.objects.filter(is_resolved=False).count()
        }

        return Response(stats)

class ContractBreachViewSet(viewsets.ModelViewSet):
    queryset = ContractBreach.objects.all()
    serializer_class = ContractBreachSerializer

    @action(detail=False, methods=['get'])
    def active_breaches(self, request):
        breaches = self.queryset.filter(is_resolved=False).order_by('-severity', '-detected_date')
        serializer = self.get_serializer(breaches, many=True)
        return Response(breaches.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        breach = self.get_object()
        breach.is_resolved = True
        breach.resolved_date = timezone.now()
        breach.resolution_notes = request.data.get('notes', '')
        breach.save()

        return Response({'status': 'breach resolved'})

class CampaignTemplateViewSet(viewsets.ModelViewSet):
    queryset = CampaignTemplate.objects.all()
    serializer_class = CampaignTemplateSerializer

    def list(self, request, *args, **kwargs):
        """Get all templates including both custom and default templates"""
        try:
            # Get custom templates from database
            custom_templates = []
            try:
                custom_templates_queryset = self.get_queryset()
                custom_templates_serializer = self.get_serializer(custom_templates_queryset, many=True)
                custom_templates = custom_templates_serializer.data
            except Exception as e:
                print(f"Error getting custom templates: {e}")
                custom_templates = []

            # Define default templates
            default_templates = [
                {
                    'id': 'welcome-series',
                    'name': 'Welcome Series',
                    'description': 'Multi-touch welcome sequence for new leads',
                    'channel_type': 'email',
                    'target_industry': 'All',
                    'subject_line': 'Welcome to the future of corporate travel - {{company_name}}',
                    'content': '''Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:

✈️ Reduce travel costs by up to 35%
📊 Streamline booking and approval processes  
🌍 Access our global partner network
🤖 AI-powered travel recommendations

Ready to see how we can help? Let's schedule a 15-minute discovery call.''',
                    'cta': 'Schedule Discovery Call',
                    'linkedin_type': None,
                    'estimated_open_rate': 45.0,
                    'estimated_click_rate': 12.0,
                    'is_custom': False,
                    'created_by': 'System',
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z'
                },
                {
                    'id': 'cost-savings',
                    'name': 'Cost Savings Focus',
                    'description': 'Emphasizes ROI and cost reduction benefits',
                    'channel_type': 'email',
                    'target_industry': 'Manufacturing',
                    'subject_line': '{{company_name}}: Cut travel costs by 35% with SOAR-AI',
                    'content': '''{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Here's what {{company_name}} could save annually:
• Current estimated budget: {{travel_budget}}
• Potential savings: {{calculated_savings}}
• ROI timeline: 3-6 months

Our AI-powered platform optimizes:
- Flight routing and pricing
- Hotel negotiations
- Policy compliance
- Expense management

Ready to see your personalized savings analysis?''',
                    'cta': 'View Savings Report',
                    'linkedin_type': None,
                    'estimated_open_rate': 52.0,
                    'estimated_click_rate': 15.0,
                    'is_custom': False,
                    'created_by': 'System',
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z'
                },
                {
                    'id': 'linkedin-connection',
                    'name': 'LinkedIn Connection Request',
                    'description': 'Professional connection request for LinkedIn outreach',
                    'channel_type': 'linkedin',
                    'target_industry': 'All',
                    'subject_line': None,
                    'content': '''Hi {{contact_name}},

I noticed {{company_name}} is expanding in the {{industry}} space. I'd love to connect and share how we're helping similar companies optimize their corporate travel operations.

Would you be open to connecting?''',
                    'cta': 'Connect on LinkedIn',
                    'linkedin_type': 'connection',
                    'estimated_open_rate': 65.0,
                    'estimated_click_rate': 25.0,
                    'is_custom': False,
                    'created_by': 'System',
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z'
                },
                {
                    'id': 'multi-channel-sequence',
                    'name': 'Multi-Channel Sequence',
                    'description': 'Coordinated outreach across email, LinkedIn, and WhatsApp',
                    'channel_type': 'mixed',
                    'target_industry': 'All',
                    'subject_line': 'Partnership opportunity with {{company_name}}',
                    'content': '''Hi {{contact_name}},

I hope this message finds you well. I've been researching {{company_name}} and I'm impressed by your growth in the {{industry}} sector.

We're helping companies like yours:
• Reduce travel costs by 25-40%
• Improve policy compliance
• Streamline approval workflows
• Access exclusive corporate rates

Would you be interested in a brief conversation about how we could support {{company_name}}'s travel operations?''',
                    'cta': 'Schedule 15-min Call',
                    'linkedin_type': 'message',
                    'estimated_open_rate': 58.0,
                    'estimated_click_rate': 18.0,
                    'is_custom': False,
                    'created_by': 'System',
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z'
                }
            ]

            # Combine default templates first, then custom templates
            all_templates = default_templates + custom_templates
            return Response(all_templates)

        except Exception as e:
            print(f"Error in CampaignTemplateViewSet.list: {e}")
            # Return just default templates if there's any error
            default_templates = [
                {
                    'id': 'welcome-series',
                    'name': 'Welcome Series',
                    'description': 'Multi-touch welcome sequence for new leads',
                    'channel_type': 'email',
                    'target_industry': 'All',
                    'subject_line': 'Welcome to the future of corporate travel',
                    'content': 'Welcome to SOAR-AI!',
                    'cta': 'Schedule Discovery Call',
                    'linkedin_type': None,
                    'estimated_open_rate': 45.0,
                    'estimated_click_rate': 12.0,
                    'is_custom': False,
                    'created_by': 'System',
                    'created_at': '2024-01-01T00:00:00Z',
                    'updated_at': '2024-01-01T00:00:00Z'
                }
            ]
            return Response(default_templates)

    @action(detail=False, methods=['get'])
    def default_templates(self, request):
        """Get default/built-in campaign templates (legacy endpoint)"""
        default_templates = [
            {
                'id': 'welcome-series',
                'name': 'Welcome Series',
                'description': 'Multi-touch welcome sequence for new leads',
                'channel_type': 'email',
                'target_industry': 'All',
                'subject_line': 'Welcome to the future of corporate travel - {{company_name}}',
                'content': '''Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:

✈️ Reduce travel costs by up to 35%
📊 Streamline booking and approval processes  
🌍 Access our global partner network
🤖 AI-powered travel recommendations

Ready to see how we can help? Let's schedule a 15-minute discovery call.''',
                'cta': 'Schedule Discovery Call',
                'linkedin_type': None,
                'estimated_open_rate': 45.0,
                'estimated_click_rate': 12.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 'cost-savings',
                'name': 'Cost Savings Focus',
                'description': 'Emphasizes ROI and cost reduction benefits',
                'channel_type': 'email',
                'target_industry': 'Manufacturing',
                'subject_line': '{{company_name}}: Cut travel costs by 35% with SOAR-AI',
                'content': '''{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Here's what {{company_name}} could save annually:
• Current estimated budget: {{travel_budget}}
• Potential savings: {{calculated_savings}}
• ROI timeline: 3-6 months

Our AI-powered platform optimizes:
- Flight routing and pricing
- Hotel negotiations
- Policy compliance
- Expense management

Ready to see your personalized savings analysis?''',
                'cta': 'View Savings Report',
                'linkedin_type': None,
                'estimated_open_rate': 52.0,
                'estimated_click_rate': 15.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 'linkedin-connection',
                'name': 'LinkedIn Connection Request',
                'description': 'Professional connection request for LinkedIn outreach',
                'channel_type': 'linkedin',
                'target_industry': 'All',
                'subject_line': None,
                'content': '''Hi {{contact_name}},

I noticed {{company_name}} is expanding in the {{industry}} space. I'd love to connect and share how we're helping similar companies optimize their corporate travel operations.

Would you be open to connecting?''',
                'cta': 'Connect on LinkedIn',
                'linkedin_type': 'connection',
                'estimated_open_rate': 65.0,
                'estimated_click_rate': 25.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 'multi-channel-sequence',
                'name': 'Multi-Channel Sequence',
                'description': 'Coordinated outreach across email, LinkedIn, and WhatsApp',
                'channel_type': 'mixed',
                'target_industry': 'All',
                'subject_line': 'Partnership opportunity with {{company_name}}',
                'content': '''Hi {{contact_name}},

I hope this message finds you well. I've been researching {{company_name}} and I'm impressed by your growth in the {{industry}} sector.

We're helping companies like yours:
• Reduce travel costs by 25-40%
• Improve policy compliance
• Streamline approval workflows
• Access exclusive corporate rates

Would you be interested in a brief conversation about how we could support {{company_name}}'s travel operations?''',
                'cta': 'Schedule 15-min Call',
                'linkedin_type': 'message',
                'estimated_open_rate': 58.0,
                'estimated_click_rate': 18.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }
        ]

        return Response(default_templates)

@api_view(['GET', 'POST'])
def proposal_draft_detail(request, opportunity_id):
    """
    Handle proposal draft operations for a specific opportunity
    """
    import os
    import uuid
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile

    try:
        opportunity = Opportunity.objects.get(id=opportunity_id)
    except Opportunity.DoesNotExist:
        return Response({'error': 'Opportunity not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Get existing draft if it exists
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)
            serializer = ProposalDraftSerializer(draft)
            draft_data = serializer.data

            # Include attachment information if exists
            if draft.attachment_path and os.path.exists(draft.attachment_path):
                draft_data['attachment_info'] = {
                    'filename': draft.attachment_original_name,
                    'path': draft.attachment_path,
                    'exists': True
                }
            else:
                draft_data['attachment_info'] = {'exists': False}

            return Response(draft_data, status=status.HTTP_200_OK)
        except ProposalDraft.DoesNotExist:
            return Response({'message': 'No draft found'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST' or request.method == 'PUT':
        # Handle file upload if present
        attachment_path = None
        attachment_original_name = None

        if 'attachment' in request.FILES:
            uploaded_file = request.FILES['attachment']

            # Create unique filename with corporate ID and timestamp
            file_extension = os.path.splitext(uploaded_file.name)[1]
            unique_filename = f"proposal_{opportunity.lead.company.id}_{opportunity.id}_{uuid.uuid4().hex[:8]}{file_extension}"

            # Create attachments directory if it doesn't exist
            attachments_dir = 'proposal_attachments'
            os.makedirs(attachments_dir, exist_ok=True)

            # Save file with unique name
            attachment_path = os.path.join(attachments_dir, unique_filename)

            # Write file to disk
            with open(attachment_path, 'wb') as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)

            attachment_original_name = uploaded_file.name

        # Prepare data for serializer
        data = request.data.copy()
        if attachment_path:
            data['attachment_path'] = attachment_path
            data['attachment_original_name'] = attachment_original_name

        # Create or update draft
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)
            serializer = ProposalDraftSerializer(draft, data=data, partial=True)
        except ProposalDraft.DoesNotExist:
            data['opportunity'] = opportunity.id
            serializer = ProposalDraftSerializer(data=data)

        if serializer.is_valid():
            saved_draft = serializer.save()

            # Include attachment info in response
            response_data = serializer.data
            if saved_draft.attachment_path and os.path.exists(saved_draft.attachment_path):
                response_data['attachment_info'] = {
                    'filename': saved_draft.attachment_original_name,
                    'path': saved_draft.attachment_path,
                    'exists': True
                }

            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Delete draft and associated files
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)

            # Delete attachment file if exists
            if draft.attachment_path and os.path.exists(draft.attachment_path):
                try:
                    os.remove(draft.attachment_path)
                except OSError:
                    pass  # File might be already deleted

            draft.delete()
            return Response({'message': 'Draft deleted successfully'}, status=status.HTTP_200_OK)
        except ProposalDraft.DoesNotExist:
            return Response({'message': 'No draft found'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        # Delete draft
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)
            draft.delete()
            return Response({'message': 'Draft deleted successfully'}, status=status.HTTP_200_OK)
        except ProposalDraft.DoesNotExist:
            return Response({'message': 'No draft found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def lead_dashboard_stats(request):
    """Get lead dashboard statistics"""
    try:
        time_period = request.GET.get('period', 'all_time')

        # Calculate date range based on period
        end_date = timezone.now()
        if time_period == 'last_30_days':
            start_date = end_date - timedelta(days=30)
        elif time_period == 'last_90_days':
            start_date = end_date - timedelta(days=90)
        elif time_period == 'this_year':
            start_date = end_date.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date = None

        # Base queryset
        leads_queryset = Lead.objects.all()
        if start_date:
            leads_queryset = leads_queryset.filter(created_at__gte=start_date)

        # Calculate basic stats
        total_leads = leads_queryset.count()
        qualified_leads = leads_queryset.filter(status='qualified').count()
        unqualified_leads = leads_queryset.filter(status='unqualified').count()
        contacted_leads = leads_queryset.filter(status='contacted').count()
        responded_leads = leads_queryset.filter(status='responded').count()

        # Calculate conversion rate
        conversion_rate = (qualified_leads / total_leads * 100) if total_leads > 0 else 0

        # Calculate email stats (mock data for now - can be enhanced with actual email tracking)
        email_open_rate = 68.5  # This would come from email campaign data
        email_open_rate_change = 5.2

        # Calculate average response time (mock data)
        avg_response_time = "2.4 hours"
        avg_response_time_change = "15% faster"

        # Calculate period-over-period changes
        if start_date:
            previous_period_start = start_date - (end_date - start_date)
            previous_leads = Lead.objects.filter(
                created_at__gte=previous_period_start,
                created_at__lt=start_date
            ).count()
            total_change = ((total_leads - previous_leads) / max(previous_leads, 1) * 100) if previous_leads > 0 else 0
        else:
            total_change = 12.5  # Mock data for all time

        stats = {
            'totalLeads': total_leads,
            'qualifiedLeads': qualified_leads,
            'unqualified': unqualified_leads,
            'contacted': contacted_leads,
            'responded': responded_leads,
            'conversionRate': round(conversion_rate, 1),
            'emailOpenRate': email_open_rate,
            'emailOpenRateChange': email_open_rate_change,
            'avgResponseTime': avg_response_time,
            'avgResponseTimeChange': avg_response_time_change,
            'totalChange': round(total_change, 1),
            'period': time_period
        }

        return Response(stats)

    except Exception as e:
        return Response({
            'error': f'Failed to fetch lead stats: {str(e)}',
            'totalLeads': 0,
            'qualifiedLeads': 0,
            'unqualified': 0,
            'contacted': 0,
            'responded': 0,
            'conversionRate': 0,
            'emailOpenRate': 0,
            'emailOpenRateChange': 0,
            'avgResponseTime': '0 hours',
            'avgResponseTimeChange': 'No change',
            'totalChange': 0
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_revenue_files(request):
    """
    List files in the revenue_prediction folder
    """
    import os

    try:
        # Get the revenue_prediction folder path
        revenue_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'revenue_prediction')

        if not os.path.exists(revenue_folder):
            return Response({
                'success': True,
                'files': [],
                'message': 'Revenue prediction folder does not exist yet'
            })

        files = []
        for filename in os.listdir(revenue_folder):
            file_path = os.path.join(revenue_folder, filename)
            if os.path.isfile(file_path):
                # Get file stats
                file_stat = os.stat(file_path)

                files.append({
                    'name': filename,
                    'size': file_stat.st_size,
                    'uploadDate': datetime.fromtimestamp(file_stat.st_mtime).isoformat() + 'Z'
                })

        # Sort by upload date (newest first)
        files.sort(key=lambda x: x['uploadDate'], reverse=True)

        return Response({
            'success': True,
            'files': files,
            'count': len(files)
        })

    except Exception as e:
        return Response(
            {'success': False, 'error': f'Failed to list files: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_revenue_file(request, filename):
    """
    Delete a specific file from the revenue_prediction folder
    """
    import os

    try:
        # Get the revenue_prediction folder path
        revenue_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'revenue_prediction')
        file_path = os.path.join(revenue_folder, filename)

        if not os.path.exists(file_path):
            return Response(
                {'success': False, 'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Delete the file
        os.remove(file_path)

        return Response({
            'success': True,
            'message': f'File "{filename}" deleted successfully'
        })

    except Exception as e:
        return Response(
            {'success': False, 'error': f'Failed to delete file: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_revenue_data(request):
    """
    Upload revenue prediction data files to server/revenue_prediction folder
    """
    import os
    import uuid
    from django.conf import settings

    try:
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES['file']
        folder = request.POST.get('folder', 'revenue_prediction')

        # Validate file type
        allowed_extensions = ['.csv', '.xlsx', '.xls']
        file_extension = os.path.splitext(uploaded_file.name)[1].lower()
        if file_extension not in allowed_extensions:
            return Response(
                {'error': 'Invalid file type. Please upload CSV or Excel files only.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size (50MB limit)
        if uploaded_file.size > 50 * 1024 * 1024:
            return Response(
                {'error': 'File size exceeds 50MB limit'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create revenue_prediction directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), folder)
        os.makedirs(upload_dir, exist_ok=True)

        # Generate unique filename to prevent conflicts
        base_name = os.path.splitext(uploaded_file.name)[0]
        unique_filename = f"{base_name}_{uuid.uuid4().hex[:8]}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)

        # Save the file
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Analyze file for row/column count if it's CSV
        rows = 0
        columns = 0
        try:
            if file_extension == '.csv':
                import pandas as pd
                df = pd.read_csv(file_path)
                rows = len(df)
                columns = len(df.columns)
            elif file_extension in ['.xlsx', '.xls']:
                import pandas as pd
                df = pd.read_excel(file_path)
                rows = len(df)
                columns = len(df.columns)
        except Exception as e:
            print(f"Error analyzing file: {e}")

        return Response({
            'success': True,
            'message': f'File "{uploaded_file.name}" uploaded successfully to {folder} folder',
            'filename': unique_filename,
            'original_name': uploaded_file.name,
            'file_path': file_path,
            'size': uploaded_file.size,
            'rows': rows,
            'columns': columns,
            'folder': folder
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Upload failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def recent_lead_activity(request):
    """Get recent lead activity for dashboard"""
    try:
        limit = int(request.GET.get('limit', 10))

        activities = []

        # Get recent lead history entries
        try:
            recent_history = LeadHistory.objects.select_related('lead').order_by('-timestamp')[:limit]

            for history in recent_history:
                activity_type = 'qualification' if 'qualified' in history.action.lower() else \
                              'disqualification' if 'disqualified' in history.action.lower() else \
                              'email' if 'email' in history.action.lower() else \
                              'response'

                activities.append({
                    'id': history.id,
                    'type': activity_type,
                    'lead': f"{history.lead.company.name}",
                    'action': history.action,
                    'time': history.timestamp.strftime('%d %b %Y, %I:%M %p'),
                    'status': history.lead.status,
                    'value': f"Score: {history.lead.score}" if history.lead.score else "No score"
                })
        except Exception as activity_error:
            print(f"Error processing history {history.id}: {activity_error}")
            # continue

        # If no history available, get recent leads as activities
        if not activities:
            recent_leads = Lead.objects.select_related('company').order_by('-updated_at')[:5]

            for i, lead in enumerate(recent_leads):
                activities.append({
                    'id': lead.id,
                    'type': 'qualification' if lead.status == 'qualified' else 'response',
                    'lead': lead.company.name,
                    'action': f'Lead {lead.status} - Recent update',
                    'time': lead.updated_at.strftime('%d %b %Y, %I:%M %p'),
                    'status': lead.status,
                    'value': f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else "No value set"
                })

        # If no activities found, return empty list
        if not activities:
            return Response([])

        return Response(activities)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def top_qualified_leads(request):
    """Get top qualified leads for dashboard"""
    try:
        limit = int(request.GET.get('limit', 5))

        # Get top qualified leads ordered by score and estimated value
        top_leads = Lead.objects.select_related('company', 'contact').filter(
            status='qualified'
        ).order_by('-score', '-estimated_value')[:limit]

        leads_data = []
        for lead in top_leads:
            try:
                # Determine engagement level based on score
                if lead.score >= 80:
                    engagement = 'High'
                elif lead.score >= 60:
                    engagement = 'Medium'
                else:
                    engagement = 'Low'

                lead_data = {
                    'id': lead.id,
                    'company': lead.company.name if lead.company else 'Unknown Company',
                    'contact': f"{lead.contact.first_name} {lead.contact.last_name}" if lead.contact else 'Unknown Contact',
                    'title': lead.contact.position if lead.contact else 'Unknown Position',
                    'industry': lead.company.industry.title() if lead.company and lead.company.industry else 'Unknown',
                    'employees': lead.company.employee_count if lead.company else 0,
                    'status': lead.status,
                    'score': lead.score,
                    'value': f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else 'TBD',
                    'engagement': engagement,
                    'nextAction': lead.next_action or 'Follow up required',
                    'lastContact': lead.updated_at.strftime('%m/%d/%Y') if lead.updated_at else 'Unknown'
                }
                leads_data.append(lead_data)

            except Exception as lead_error:
                print(f"Error processing lead {lead.id}: {lead_error}")
                continue

        return Response(leads_data)

    except Exception as e:
        print(f"Error in top leads endpoint: {str(e)}")
        return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer

    @action(detail=False, methods=['post'])
    def launch(self, request):
        """Launch an email campaign"""
        try:
            data = request.data
            template_id = data.get('templateId')
            target_leads = data.get('targetLeads', [])
            subject_line = data.get('subjectLine', '')
            message_content = data.get('messageContent', '')

            # Create the campaign
            campaign = EmailCampaign.objects.create(
                name=f"Campaign - {subject_line[:50]}",
                description=data.get('description', ''),
                campaign_type='nurture',
                status='active',
                subject_line=subject_line,
                email_content=message_content,
                scheduled_date=timezone.now(),
                sent_date=timezone.now(),
                target_count=len(target_leads)
            )

            # Add target leads to campaign
            for lead_id in target_leads:
                try:
                    lead = Lead.objects.get(id=lead_id)
                    campaign.target_leads.add(lead)
                except Lead.DoesNotExist:
                    continue

            # Send emails
            result = campaign.send_emails()

            serializer = self.get_serializer(campaign)
            return Response({
                'campaign': serializer.data,
                'send_result': result
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Failed to launch campaign: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([AllowAny])
def get_history(request):
    """Get history for leads or opportunities"""
    try:
        lead_id = request.data.get('lead_id')
        entity_type = request.data.get('entity_type')
        entity_id = request.data.get('entity_id')

        if lead_id:
            # Get lead history
            try:
                lead = Lead.objects.get(id=lead_id)
                history_entries = lead.history_entries.all().order_by('-timestamp')
                serializer = LeadHistorySerializer(history_entries, many=True)
                return Response(serializer.data)
            except Lead.DoesNotExist:
                return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response([], status=status.HTTP_200_OK)

        elif entity_type == 'opportunity' and entity_id:
            # Get opportunity history
            try:
                opportunity = Opportunity.objects.get(id=entity_id)
                activities = opportunity.activities.all().order_by('-created_at')
                activity_data = []

                for activity in activities:
                    activity_data.append({
                        'id': activity.id,
                        'type': activity.type,
                        'action': activity.get_type_display(),
                        'details': activity.description,
                        'timestamp': activity.created_at.isoformat(),
                        'user_name': activity.created_by.get_full_name() if activity.created_by else 'System',
                        'date': activity.date.isoformat() if activity.date else ''
                    })

                return Response(activity_data)
            except Opportunity.DoesNotExist:
                return Response({'error': 'Opportunity not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def campaign_analytics(request):
    """Get campaign analytics data"""
    try:
        campaigns = EmailCampaign.objects.all()
        analytics_data = []

        for campaign in campaigns:
            open_rate = (campaign.emails_opened / campaign.emails_sent * 100) if campaign.emails_sent > 0 else 0
            click_rate = (campaign.emails_clicked / campaign.emails_sent * 100) if campaign.emails_sent > 0 else 0

            analytics_data.append({
                'id': campaign.id,
                'name': campaign.name,
                'status': campaign.status,
                'emails_sent': campaign.emails_sent,
                'emails_opened': campaign.emails_opened,
                'emails_clicked': campaign.emails_clicked,
                'open_rate': round(open_rate, 2),
                'click_rate': round(click_rate, 2),
                'created_at': campaign.created_at
            })

        return Response({
            'success': True,
            'analytics': analytics_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)