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
        filters = request.data

        # Use select_related and prefetch_related for optimization
        queryset = self.queryset.select_related(
            'company', 'contact', 'assigned_to'
        ).prefetch_related(
            'lead_notes__created_by'
        )

        search_term = filters.get('search', '')
        status_filter = filters.get('status', '')
        industry_filter = filters.get('industry', '')
        score = filters.get('score', '')
        engagement = filters.get('engagement', '')

        # Get all leads with proper eager loading, excluding those converted to opportunities
        leads = Lead.objects.select_related('company', 'contact', 'assigned_to').filter(opportunity__isnull=True)

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

        # Use optimized serializer for better performance
        from .serializers import OptimizedLeadSerializer
        serializer = OptimizedLeadSerializer(leads, many=True)
        return Response(serializer.data)

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
            reason = request.data.get('reason', '')
            old_status = lead.status

            lead.status = 'unqualified'
            lead.notes = f"{lead.notes}\n\n[{timezone.now().strftime('%Y-%m-%d %H:%M')}] Disqualified: {reason}" if lead.notes else f"[{timezone.now().strftime('%Y-%m-%d %H:%M')}] Disqualified: {reason}"
            lead.save()

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
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        try:
            lead = self.get_object()
            note_text = request.data.get('note', '')
            next_action = request.data.get('next_action', '')
            urgency = request.data.get('urgency', 'Medium')
            old_status = lead.status
            old_priority = lead.priority
            old_next_action = lead.next_action # Capture old next_action for potential history entry

            if not note_text.strip():
                return Response({'error': 'Note text is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Create the note
            note = LeadNote.objects.create(
                lead=lead,
                note=note_text,
                next_action=next_action,
                urgency=urgency,
                created_by=request.user if request.user.is_authenticated else None
            )

            # Update lead's next action and urgency if provided
            if next_action:
                lead.next_action = next_action
            if urgency and urgency in ['Low', 'Medium', 'High', 'Urgent']:
                # Map urgency to priority
                priority_map = {'Low': 'low', 'Medium': 'medium', 'High': 'high', 'Urgent': 'urgent'}
                lead.priority = priority_map.get(urgency, 'medium')

            lead.save()

            # Create history entry for note addition
            create_lead_history(
                lead=lead,
                history_type='note_added',
                action=f'Note added: "{note_text[:30]}..."',
                details=f"Note content: {note_text}. Next action: {next_action if next_action else 'None'}. Urgency: {urgency}.",
                icon='file-text',
                user=request.user if request.user.is_authenticated else None
            )

            # If priority changed due to urgency, create history for that too
            if old_priority != lead.priority and lead.priority != 'medium':
                create_lead_history(
                    lead=lead,
                    history_type='priority_change',
                    action=f'Priority changed to {lead.priority}',
                    details=f'Priority updated from {old_priority} to {lead.priority} due to note urgency.',
                    icon='trending-up',
                    user=request.user if request.user.is_authenticated else None
                )

            # If next action changed, create history for that too
            if old_next_action != lead.next_action:
                create_lead_history(
                    lead=lead,
                    history_type='next_action_update',
                    action=f'Next action updated to "{lead.next_action[:30]}..."',
                    details=f'Next action updated from "{old_next_action}" to "{lead.next_action}".',
                    icon='calendar',
                    user=request.user if request.user.is_authenticated else None
                )


            # Return both the note data and updated lead information
            note_serializer = LeadNoteSerializer(note)
            lead_serializer = LeadSerializer(lead)

            return Response({
                'note': note_serializer.data,
                'lead': lead_serializer.data,
                'message': 'Note added successfully'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status
        old_score = instance.score
        old_priority = instance.priority
        old_next_action = instance.next_action

        response = super().update(request, *args, **kwargs)
        updated_instance = self.get_object()

        # Track changes and create history entries
        if instance:
            # Track status changes
            if old_status != updated_instance.status:
                try:
                    LeadHistory.objects.create(
                        lead=updated_instance,
                        history_type='status_change',
                        action=f'Status changed to {updated_instance.get_status_display()}',
                        details=f'Lead status updated from {old_status} to {updated_instance.status}. Lead is now {updated_instance.get_status_display().lower()}.',
                        icon=self.get_status_icon(updated_instance.status),
                        user=request.user if request.user.is_authenticated else None
                    )
                except Exception as e:
                    print(f"Error creating lead history: {e}")

            # Track score changes
            if old_score != updated_instance.score:
                try:
                    LeadHistory.objects.create(
                        lead=updated_instance,
                        history_type='score_update',
                        action=f'Lead score updated to {updated_instance.score}',
                        details=f'Lead score updated from {old_score} to {updated_instance.score} based on engagement metrics and profile analysis.',
                        icon='trending-up',
                        user=request.user if request.user.is_authenticated else None
                    )
                except Exception as e:
                    print(f"Error creating lead history: {e}")

            # Track priority changes
            if old_priority != updated_instance.priority:
                try:
                    LeadHistory.objects.create(
                        lead=updated_instance,
                        history_type='score_update',
                        action=f'Priority changed to {updated_instance.priority}',
                        details=f'Lead priority updated from {old_priority} to {updated_instance.priority}.',
                        icon='trending-up',
                        user=request.user if request.user.is_authenticated else None
                    )
                except Exception as e:
                    print(f"Error creating lead history: {e}")

            # Track next action changes
            if old_next_action != updated_instance.next_action:
                try:
                    LeadHistory.objects.create(
                        lead=updated_instance,
                        history_type='next_action_update',
                        action=f'Next action updated to "{updated_instance.next_action[:30]}..."',
                        details=f'Next action updated from "{old_next_action}" to "{updated_instance.next_action}".',
                        icon='calendar',
                        user=request.user if request.user.is_authenticated else None
                    )
                except Exception as e:
                    print(f"Error creating lead history: {e}")

        return response

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
                stage=opportunity_data.get('stage', 'proposal'),
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
                    formatted_timestamp = activity.created_at.strftime('%m/%d/%Y at %I:%M:%S %p') if activity.created_at else 'Unknown'

                    history_items.append({
                        'id': f"activity_{activity.id}",
                        'history_type': 'activity',
                        'action': f"{activity.get_type_display()} - {activity.description[:50]}{'...' if len(activity.description) > 50 else ''}",
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
                            formatted_timestamp = history.timestamp.strftime('%m/%d/%Y at %I:%M:%S %p') if history.timestamp else 'Unknown'

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
            try:
                history_items.sort(key=lambda x: x['timestamp'] if x['timestamp'] else '', reverse=True)
            except Exception as sort_error:
                print(f"Error sorting history items: {sort_error}")

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

class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer

    def create(self, request, *args, **kwargs):
        """Create new email campaign"""
        try:
            data = request.data

            # Create the campaign
            campaign = EmailCampaign.objects.create(
                name=data.get('name', 'New Campaign'),
                description=data.get('description', ''),
                campaign_type=data.get('campaign_type', 'nurture'),
                status='draft',  # Set as draft initially
                subject_line=data.get('subject_line', ''),
                email_content=data.get('email_content', ''),
                scheduled_date=timezone.now(),
                emails_sent=0,
                emails_opened=0,
                emails_clicked=0
            )

            # Add target leads if provided
            target_lead_ids = data.get('target_leads', [])
            if target_lead_ids:
                leads = Lead.objects.filter(id__in=target_lead_ids)
                campaign.target_leads.set(leads)
                print(f"Campaign {campaign.id} created with {leads.count()} target leads")

            serializer = self.get_serializer(campaign)
            return Response({
                'success': True,
                'message': 'Campaign created successfully!',
                'campaign': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'success': False,
                'error': f'Failed to create campaign: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def launch(self, request, pk=None):
        """Launch campaign and send emails to target leads"""
        try:
            campaign = self.get_object()

            if campaign.status == 'active':
                return Response({
                    'success': False,
                    'message': 'Campaign is already active'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if campaign has target leads
            if not campaign.target_leads.exists():
                return Response({
                    'success': False,
                    'message': 'Campaign has no target leads. Please add leads to the campaign before launching.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Send emails
            result = campaign.send_emails()

            if result['success']:
                return Response({
                    'success': True,
                    'message': result['message'],
                    'campaign_id': campaign.id,
                    'emails_sent': result['sent_count'],
                    'smtp_responses': result.get('smtp_responses', []),
                    'log_file': result.get('log_file', ''),
                    'smtp_details': {
                        'success_rate': f"{(result['sent_count']/(result['sent_count']+result.get('failed_count', 0))*100):.1f}%" if (result['sent_count'] + result.get('failed_count', 0)) > 0 else "0%",
                        'total_processed': result['sent_count'] + result.get('failed_count', 0)
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': result['message'],
                    'smtp_responses': result.get('smtp_responses', []),
                    'log_file': result.get('log_file', '')
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'success': False,
                'message': f'Failed to launch campaign: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def performance(self, request):
        campaigns = self.queryset.filter(status__in=['active', 'completed'])

        performance_data = []
        for campaign in campaigns:
            open_rate = (campaign.emails_opened / campaign.emails_sent * 100) if campaign.emails_sent > 0 else 0
            click_rate = (campaign.emails_clicked / campaign.emails_sent * 100) if campaign.emails_sent > 0 else 0

            performance_data.append({
                'id': campaign.id,
                'name': campaign.name,
                'emails_sent': campaign.emails_sent,
                'open_rate': open_rate,
                'click_rate': click_rate,
                'status': campaign.status
            })

        return Response(performance_data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def check_smtp_status(request, campaign_id=None):
    """Check SMTP server status and connection"""
    import smtplib
    from django.conf import settings
    from django.core.mail import get_connection

    try:
        # Get SMTP settings
        smtp_host = getattr(settings, 'EMAIL_HOST', None)
        smtp_port = getattr(settings, 'EMAIL_PORT', 587)
        smtp_user = getattr(settings, 'EMAIL_HOST_USER', None)
        smtp_password = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
        use_tls = getattr(settings, 'EMAIL_USE_TLS', True)

        # Check if required settings are configured
        if not smtp_host or not smtp_user:
            return Response({
                'status': 'error',
                'message': 'SMTP settings not configured properly. Please check EMAIL_HOST and EMAIL_HOST_USER settings.',
                'details': {
                    'host_configured': bool(smtp_host),
                    'user_configured': bool(smtp_user),
                    'password_configured': bool(smtp_password)
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # Test SMTP connection
        try:
            connection = get_connection(
                host=smtp_host,
                port=smtp_port,
                username=smtp_user,
                password=smtp_password,
                use_tls=use_tls,
                fail_silently=False
            )

            connection.open()
            connection.close()

            return Response({
                'status': 'connected',
                'message': f'SMTP server connection successful to {smtp_host}:{smtp_port}',
                'details': {
                    'host': smtp_host,
                    'port': smtp_port,
                    'username': smtp_user,
                    'use_tls': use_tls,
                    'connection_test': 'passed'
                }
            })

        except smtplib.SMTPAuthenticationError as e:
            return Response({
                'status': 'error',
                'message': f'SMTP Authentication failed: {str(e)}',
                'details': {
                    'host': smtp_host,
                    'port': smtp_port,
                    'username': smtp_user,
                    'error_type': 'authentication_error'
                }
            }, status=status.HTTP_401_UNAUTHORIZED)

        except smtplib.SMTPConnectError as e:
            return Response({
                'status': 'error',
                'message': f'SMTP Connection failed: {str(e)}',
                'details': {
                    'host': smtp_host,
                    'port': smtp_port,
                    'error_type': 'connection_error'
                }
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'SMTP Error: {str(e)}',
                'details': {
                    'host': smtp_host,
                    'port': smtp_port,
                    'error_type': 'general_error'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Configuration error: {str(e)}',
            'details': {
                'error_type': 'configuration_error'
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TravelOfferViewSet(viewsets.ModelViewSet):
    queryset = TravelOffer.objects.all()
    serializer_class = TravelOfferSerializer

    @action(detail=False, methods=['get'])
    def active_offers(self, request):
        offers = self.queryset.filter(
            status='active',
            valid_until__gt=timezone.now()
        ).order_by('-created_at')

        serializer = self.get_serializer(offers, many=True)
        return Response(offers.data)

    @action(detail=False, methods=['get'])
    def performance_dashboard(self, request):
        total_offers = self.queryset.count()
        active_offers = self.queryset.filter(status='active').count()
        total_bookings = self.queryset.aggregate(total=Sum('bookings_count'))['total'] or 0
        total_revenue = self.queryset.aggregate(total=Sum('revenue_generated'))['total'] or 0

        stats = {
            'total_offers': total_offers,
            'active_offers': active_offers,
            'total_bookings': total_bookings,
            'total_revenue': total_revenue,
            'average_booking_value': (total_revenue / total_bookings) if total_bookings > 0 else 0
        }

        return Response(stats)

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_tickets = self.queryset.count()
        open_tickets = self.queryset.filter(status__in=['open', 'in_progress']).count()
        high_priority = self.queryset.filter(
            priority__in=['high', 'urgent'],
            status__in=['open', 'in_progress']
        ).count()

        resolved_tickets = self.queryset.filter(status='resolved')
        if resolved_tickets.exists():
            avg_resolution_time = resolved_tickets.aggregate(
                avg_time=Avg('resolved_at') - Avg('created_at')
            )['avg_time']
            avg_resolution_hours = avg_resolution_time.total_seconds() / 3600 if avg_resolution_time else 0
        else:
            avg_resolution_hours = 0

        satisfaction_scores = self.queryset.filter(satisfaction_rating__isnull=False)
        avg_satisfaction = satisfaction_scores.aggregate(avg=Avg('satisfaction_rating'))['avg'] or 0

        stats = {
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'high_priority': high_priority,
            'avg_resolution_time_hours': round(avg_resolution_hours, 2),
            'satisfaction_score': round(avg_satisfaction, 1)
        }

        return Response(stats)

    @action(detail=False, methods=['get'])
    def agent_workload(self, request):
        from django.contrib.auth.models import User

        agents = User.objects.filter(
            supportticket__isnull=False
        ).annotate(
            assigned_tickets=Count('supportticket', filter=Q(supportticket__status__in=['open', 'in_progress']))
        ).distinct()

        workload = []
        for agent in agents:
            workload.append({
                'agent_name': f"{agent.first_name} {agent.last_name}" if agent.first_name else agent.username,
                'assigned_tickets': agent.assigned_tickets,
                'total_resolved': self.queryset.filter(assigned_to=agent, status='resolved').count()
            })

        return Response(workload)

class RevenueForecastViewSet(viewsets.ModelViewSet):
    queryset = RevenueForecast.objects.all()
    serializer_class = RevenueForecastSerializer

    @action(detail=False, methods=['get'])
    def current_year(self, request):
        current_year = timezone.now().year
        forecasts = self.queryset.filter(
            period__startswith=str(current_year)
        ).order_by('period')

        serializer = self.get_serializer(forecasts, many=True)
        return Response(serializer.data)

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer

    def get_queryset(self):
        queryset = self.queryset
        entity_type = self.request.query_params.get('entity_type', None)
        entity_id = self.request.query_params.get('entity_id', None)

        if entity_type:
            queryset = queryset.filter(entity_type=entity_type)
        if entity_id:
            queryset = queryset.filter(entity_id=entity_id)

        return queryset

class LeadNoteViewSet(viewsets.ModelViewSet):
    queryset = LeadNote.objects.all()
    serializer_class = LeadNoteSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)

    def get_queryset(self):
        queryset = self.queryset
        lead_id = self.request.query_params.get('lead_id', None)

        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)

        return queryset

class LeadHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LeadHistory.objects.all()
    serializer_class = LeadHistorySerializer

    def get_queryset(self):
        queryset = self.queryset
        lead_id = self.request.query_params.get('lead_id', None)

        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)

        return queryset.order_by('timestamp')

class AIConversationViewSet(viewsets.ModelViewSet):
    queryset = AIConversation.objects.all()
    serializer_class = AIConversationSerializer

    @action(detail=False, methods=['post'])
    def chat(self, request):
        # This would integrate with your AI service
        query = request.data.get('query', '')
        user = request.user if request.user.is_authenticated else None

        # Mock AI response for now
        response = f"Thank you for your query: '{query}'. This is a mock AI response. In a real implementation, this would connect to your AI service."

        conversation = AIConversation.objects.create(
            user=user,
            query=query,
            response=response,
            context=request.data.get('context', {}),
            entities_mentioned=request.data.get('entities', []),
            actions_suggested=['View Dashboard', 'Search Companies', 'Create Lead']
        )

        serializer = self.get_serializer(conversation)
        return Response(serializer.data)

@api_view(['GET'])
def download_proposal_attachment(request, opportunity_id):
    """
    Download attachment for a proposal draft
    """
    import os
    from django.http import FileResponse, Http404
    
    try:
        opportunity = Opportunity.objects.get(id=opportunity_id)
        draft = ProposalDraft.objects.get(opportunity=opportunity)
        
        if not draft.attachment_path or not os.path.exists(draft.attachment_path):
            raise Http404("Attachment not found")
        
        # Return file response
        response = FileResponse(
            open(draft.attachment_path, 'rb'),
            filename=draft.attachment_original_name or 'attachment'
        )
        return response
        
    except (Opportunity.DoesNotExist, ProposalDraft.DoesNotExist):
        raise Http404("Draft or opportunity not found")

class ProposalDraftViewSet(viewsets.ModelViewSet):
    queryset = ProposalDraft.objects.all()
    serializer_class = ProposalDraftSerializer

    def get_queryset(self):
        queryset = self.queryset
        opportunity_id = self.request.query_params.get('opportunity_id', None)

        if opportunity_id:
            queryset = queryset.filter(opportunity_id=opportunity_id)

        return queryset

    @action(detail=True, methods=['post'])
    def save_draft(self, request, pk=None):
        """Save or update proposal draft"""
        try:
            draft = self.get_object()
            serializer = self.get_serializer(draft, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Draft saved successfully',
                    'draft': serializer.data
                })
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Dashboard API Views
class DashboardAPIView(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def overview(self, request):
        # Get overview stats for the main dashboard
        overview_data = {
            'companies': {
                'total': Company.objects.filter(is_active=True).count(),
                'new_this_month': Company.objects.filter(
                    created_at__gte=timezone.now().replace(day=1)
                ).count()
            },
            'leads': {
                'total': Lead.objects.count(),
                'qualified': Lead.objects.filter(status='qualified').count(),
                'conversion_rate': (Lead.objects.filter(status='won').count() / max(Lead.objects.count(), 1)) * 100
            },
            'opportunities': {
                'total': Opportunity.objects.count(),
                'total_value': Opportunity.objects.aggregate(total=Sum('value'))['total'] or 0,
                'weighted_value': sum(
                    float(opp.value) * (opp.probability / 100)
                    for opp in Opportunity.objects.all()
                )
            },
            'contracts': {
                'active': Contract.objects.filter(status='active').count(),
                'expiring_soon': Contract.objects.filter(
                    end_date__lte=timezone.now().date() + timedelta(days=30),
                    status='active'
                ).count(),
                'total_value': Contract.objects.aggregate(total=Sum('value'))['total'] or 0
            },
            'support': {
                'open_tickets': SupportTicket.objects.filter(status__in=['open', 'in_progress']).count(),
                'high_priority': SupportTicket.objects.filter(
                    priority__in=['high', 'urgent'],
                    status__in=['open', 'in_progress']
                ).count()
            }
        }

        return Response(overview_data)

# Add the new endpoints
# Helper functions for bulk upload
def _map_industry(industry):
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

def _map_company_size(size):
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

def _map_company_type(company_type):
    """Map company type values to model choices"""
    type_mapping = {
        'corporation': 'corporation',
        'llc': 'llc',
        'partnership': 'partnership',
        'nonprofit': 'nonprofit',
        'non-profit': 'nonprofit'
    }
    return type_mapping.get(company_type.lower(), 'corporation')

def _map_travel_frequency(frequency):
    """Map travel frequency values to model choices"""
    frequency_mapping = {
        'daily': 'Daily',
        'weekly': 'Weekly',
        'monthly': 'Monthly',
        'quarterly': 'Quarterly',
        'bi-weekly': 'Bi-weekly'
    }
    return frequency_mapping.get(frequency.lower(), '')

def _map_preferred_class(pref_class):
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

def _map_credit_rating(rating):
    """Map credit rating values to model choices"""
    rating_mapping = {
        'aaa': 'AAA',
        'aa': 'AA',
        'a': 'A',
        'bbb': 'BBB',
        'bb': 'BB'
    }
    return rating_mapping.get(rating.lower(), '')

def _map_payment_terms(terms):
    """Map payment terms values to model choices"""
    terms_mapping = {
        'net 15': 'Net 15',
        'net 30': 'Net 30',
        'net 45': 'Net 45',
        'net 60': 'Net 60'
    }
    return terms_mapping.get(terms.lower(), '')

def _map_sustainability(sustainability):
    """Map sustainability values to model choices"""
    sustainability_mapping = {
        'very high': 'Very High',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low'
    }
    return sustainability_mapping.get(sustainability.lower(), '')

def _map_risk_level(risk):
    """Map risk level values to model choices"""
    risk_mapping = {
        'very low': 'Very Low',
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
    }
    return risk_mapping.get(risk.lower(), '')

def _map_expansion_plans(plans):
    """Map expansion plans values to model choices"""
    plans_mapping = {
        'aggressive': 'Aggressive',
        'moderate': 'Moderate',
        'conservative': 'Conservative',
        'rapid': 'Rapid',
        'stable': 'Stable'
    }
    return plans_mapping.get(plans.lower(), '')

def _safe_int(value):
    """Safely convert value to integer"""
    import pandas as pd
    if pd.isna(value) or value == '':
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None

def _safe_decimal(value, multiplier=1):
    """Safely convert value to decimal with optional multiplier"""
    import pandas as pd
    if pd.isna(value) or value == '':
        return None
    try:
        return float(value) * multiplier
    except (ValueError, TypeError):
        return None

@api_view(['POST'])
def bulk_upload_companies(request):
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
            'name', 'industry', 'size', 'location', 'email'
        ]

        # Check if the columns exist (case-insensitive)
        df_columns = [col.lower() for col in df.columns]
        missing_columns = []

        for required_col in required_columns:
            if required_col not in df_columns:
                missing_columns.append(required_col)

        if missing_columns:
            return Response(
                {'error': f'Missing required columns: {", ".join(missing_columns)}. Found columns: {", ".join(df.columns)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process the data
        created_count = 0
        skipped_count = 0
        errors = []

        for index, row in df.iterrows():
            try:
                # Get company name (handle different column name formats)
                company_name = None
                for col in df.columns:
                    if 'name' in col.lower():
                        company_name = str(row[col]).strip() if not pd.isna(row[col]) else None
                        break

                if not company_name or company_name == 'nan':
                    skipped_count += 1
                    continue

                # Check if company already exists
                if Company.objects.filter(name__iexact=company_name).exists():
                    skipped_count += 1
                    continue

                # Map form fields to model fields using helper functions
                company_data = {
                    'name': company_name,
                    'industry': _map_industry(str(row.get('industry', '')).strip()),
                    'size': _map_company_size(str(row.get('size', '')).strip()),
                    'location': str(row.get('location', '')).strip(),
                    'email': str(row.get('email', '')).strip(),
                    'phone': str(row.get('phone', '')).strip(),
                    'website': str(row.get('website', '')).strip(),
                    'company_type': _map_company_type(str(row.get('company_type', '')).strip()),
                    'year_established': _safe_int(row.get('year_established')),
                    'employee_count': _safe_int(row.get('employee_count')),
                    'annual_revenue': _safe_decimal(row.get('annual_revenue')),
                    'travel_budget': _safe_decimal(row.get('travel_budget')),
                    'annual_travel_volume': str(row.get('annual_travel_volume', '')).strip(),
                    'travel_frequency': _map_travel_frequency(str(row.get('travel_frequency', '')).strip()),
                    'preferred_class': _map_preferred_class(str(row.get('preferred_class', '')).strip()),
                    'credit_rating': _map_credit_rating(str(row.get('credit_rating', '')).strip()),
                    'payment_terms': _map_payment_terms(str(row.get('payment_terms', '')).strip()),
                    'sustainability_focus': _map_sustainability(str(row.get('sustainability_focus', '')).strip()),
                    'risk_level': _map_risk_level(str(row.get('risk_level', '')).strip()),
                    'expansion_plans': _map_expansion_plans(str(row.get('expansion_plans', '')).strip()),
                    'specialties': str(row.get('specialties', '')).strip(),
                    'technology_integration': str(row.get('technology_integration', '')).strip(),
                    'current_airlines': str(row.get('current_airlines', '')).strip(),
                    'description': str(row.get('description', '')).strip(),
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

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def download_sample_excel(request):
    """
    Generate and return a sample Excel file with dummy corporate data
    """
    import io
    from django.http import HttpResponse
    from datetime import datetime

    try:
        # Try pandas first, fall back to openpyxl if pandas fails
        try:
            import pandas as pd
            use_pandas = True
        except (ImportError, ValueError) as e:
            print(f"Pandas import failed: {e}, using openpyxl fallback")
            use_pandas = False

        if not use_pandas:
            # Fallback implementation using openpyxl directly
            from openpyxl import Workbook
            from openpyxl.utils.dataframe import dataframe_to_rows

            # Create workbook
            wb = Workbook()
            ws = wb.active
            ws.title = "Corporate Data Sample"

            # Define headers
            headers = [
                'name', 'company_type', 'industry', 'location', 'email', 'phone', 'website',
                'employee_count', 'annual_revenue', 'year_established', 'size', 'credit_rating',
                'payment_terms', 'travel_budget', 'annual_travel_volume', 'travel_frequency',
                'preferred_class', 'sustainability_focus', 'risk_level', 'current_airlines',
                'expansion_plans', 'specialties', 'technology_integration', 'description'
            ]

            # Add headers
            ws.append(headers)

            # Sample data
            sample_rows = [
                [
                    'TechCorp Solutions', 'corporation', 'technology', 'San Francisco, CA',
                    'contact@techcorp.com', '+1-555-0123', 'https://techcorp.com', 500,
                    50000000, 2010, 'medium', 'AA', 'Net 30', 2000000, '$2M annually',
                    'Weekly', 'Business', 'High', 'Low', 'United, Delta, American',
                    'Aggressive', 'AI, Machine Learning, Cloud Computing',
                    'Advanced CRM, API Integration, Mobile Apps',
                    'Leading technology solutions provider specializing in enterprise software and cloud services.'
                ],
                [
                    'Global Manufacturing Inc', 'corporation', 'manufacturing', 'Detroit, MI',
                    'info@globalmanuf.com', '+1-555-0456', 'https://globalmanuf.com', 1200,
                    120000000, 1995, 'large', 'AAA', 'Net 45', 5000000, '$5M annually',
                    'Monthly', 'Economy Plus', 'Very High', 'Very Low', 'Southwest, JetBlue',
                    'Moderate', 'Automotive Parts, Industrial Equipment, Supply Chain',
                    'ERP Systems, IoT Sensors, Automation',
                    'Leading manufacturer of automotive components and industrial equipment with global operations.'
                ],
                [
                    'HealthCare Partners LLC', 'llc', 'healthcare', 'Boston, MA',
                    'contact@healthpartners.com', '+1-555-0789', 'https://healthpartners.com', 300,
                    25000000, 2005, 'medium', 'A', 'Net 30', 800000, '$800K annually',
                    'Bi-weekly', 'Economy', 'Medium', 'Medium', 'Delta, American',
                    'Conservative', 'Medical Devices, Patient Care, Telemedicine',
                    'EMR Systems, Patient Portals, Telehealth',
                    'Healthcare services provider focused on innovative patient care and medical technology solutions.'
                ],
                [
                    'Financial Advisors Group', 'partnership', 'finance', 'New York, NY',
                    'info@finadvgroup.com', '+1-555-0321', 'https://finadvgroup.com', 150,
                    35000000, 2000, 'small', 'BBB', 'Net 15', 1200000, '$1.2M annually',
                    'Daily', 'First', 'Low', 'High', 'United, Delta',
                    'Rapid', 'Investment Banking, Portfolio Management, Risk Assessment',
                    'Trading Platforms, Risk Analytics, Mobile Banking',
                    'Premier financial advisory firm providing comprehensive investment and wealth management services.'
                ],
                [
                    'Green Energy Solutions', 'corporation', 'energy', 'Austin, TX',
                    'contact@greenenergy.com', '+1-555-0654', 'https://greenenergy.com', 800,
                    75000000, 2012, 'large', 'AA', 'Net 60', 3000000, '$3M annually',
                    'Quarterly', 'Business/First', 'Very High', 'Low', 'Southwest, United',
                    'Aggressive', 'Solar Power, Wind Energy, Battery Storage, Grid Solutions',
                    'Smart Grid, IoT Monitoring, AI Optimization',
                    'Leading renewable energy company specializing in solar and wind power solutions for commercial and residential markets.'
                ]
            ]

            # Add sample data
            for row in sample_rows:
                ws.append(row)

            # Auto-adjust column widths
            for column in ws.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                ws.column_dimensions[column_letter].width = adjusted_width

            # Save to memory
            output = io.BytesIO()
            wb.save(output)
            output.seek(0)

        else:
            # Original pandas implementation
            # Sample data that matches the Company model fields
            sample_data = [
                {
                    'name': 'TechCorp Solutions',
                    'company_type': 'corporation',
                    'industry': 'technology',
                    'location': 'San Francisco, CA',
                    'email': 'contact@techcorp.com',
                    'phone': '+1-555-0123',
                    'website': 'https://techcorp.com',
                    'employee_count': 500,
                    'annual_revenue': 50000000,
                    'year_established': 2010,
                    'size': 'medium',
                    'credit_rating': 'AA',
                    'payment_terms': 'Net 30',
                    'travel_budget': 2000000,
                    'annual_travel_volume': '$2M annually',
                    'travel_frequency': 'Weekly',
                    'preferred_class': 'Business',
                    'sustainability_focus': 'High',
                    'risk_level': 'Low',
                    'current_airlines': 'United, Delta, American',
                    'expansion_plans': 'Aggressive',
                    'specialties': 'AI, Machine Learning, Cloud Computing',
                    'technology_integration': 'Advanced CRM, API Integration, Mobile Apps',
                    'description': 'Leading technology solutions provider specializing in enterprise software and cloud services.'
                },
                {
                    'name': 'Global Manufacturing Inc',
                    'company_type': 'corporation',
                    'industry': 'manufacturing',
                    'location': 'Detroit, MI',
                    'email': 'info@globalmanuf.com',
                    'phone': '+1-555-0456',
                    'website': 'https://globalmanuf.com',
                    'employee_count': 1200,
                    'annual_revenue': 120000000,
                    'year_established': 1995,
                    'size': 'large',
                    'credit_rating': 'AAA',
                    'payment_terms': 'Net 45',
                    'travel_budget': 5000000,
                    'annual_travel_volume': '$5M annually',
                    'travel_frequency': 'Monthly',
                    'preferred_class': 'Economy Plus',
                    'sustainability_focus': 'Very High',
                    'risk_level': 'Very Low',
                    'current_airlines': 'Southwest, JetBlue',
                    'expansion_plans': 'Moderate',
                    'specialties': 'Automotive Parts, Industrial Equipment, Supply Chain',
                    'technology_integration': 'ERP Systems, IoT Sensors, Automation',
                    'description': 'Leading manufacturer of automotive components and industrial equipment with global operations.'
                },
                {
                    'name': 'HealthCare Partners LLC',
                    'company_type': 'llc',
                    'industry': 'healthcare',
                    'location': 'Boston, MA',
                    'email': 'contact@healthpartners.com',
                    'phone': '+1-555-0789',
                    'website': 'https://healthpartners.com',
                    'employee_count': 300,
                    'annual_revenue': 25000000,
                    'year_established': 2005,
                    'size': 'medium',
                    'credit_rating': 'A',
                    'payment_terms': 'Net 30',
                    'travel_budget': 800000,
                    'annual_travel_volume': '$800K annually',
                    'travel_frequency': 'Bi-weekly',
                    'preferred_class': 'Economy',
                    'sustainability_focus': 'Medium',
                    'risk_level': 'Medium',
                    'current_airlines': 'Delta, American',
                    'expansion_plans': 'Conservative',
                    'specialties': 'Medical Devices, Patient Care, Telemedicine',
                    'technology_integration': 'EMR Systems, Patient Portals, Telehealth',
                    'description': 'Healthcare services provider focused on innovative patient care and medical technology solutions.'
                },
                {
                    'name': 'Financial Advisors Group',
                    'company_type': 'partnership',
                    'industry': 'finance',
                    'location': 'New York, NY',
                    'email': 'info@finadvgroup.com',
                    'phone': '+1-555-0321',
                    'website': 'https://finadvgroup.com',
                    'employee_count': 150,
                    'annual_revenue': 35000000,
                    'year_established': 2000,
                    'size': 'small',
                    'credit_rating': 'BBB',
                    'payment_terms': 'Net 15',
                    'travel_budget': 1200000,
                    'annual_travel_volume': '$1.2M annually',
                    'travel_frequency': 'Daily',
                    'preferred_class': 'First',
                    'sustainability_focus': 'Low',
                    'risk_level': 'High',
                    'current_airlines': 'United, Delta',
                    'expansion_plans': 'Rapid',
                    'specialties': 'Investment Banking, Portfolio Management, Risk Assessment',
                    'technology_integration': 'Trading Platforms, Risk Analytics, Mobile Banking',
                    'description': 'Premier financial advisory firm providing comprehensive investment and wealth management services.'
                },
                {
                    'name': 'Green Energy Solutions',
                    'company_type': 'corporation',
                    'industry': 'energy',
                    'location': 'Austin, TX',
                    'email': 'contact@greenenergy.com',
                    'phone': '+1-555-0654',
                    'website': 'https://greenenergy.com',
                    'employee_count': 800,
                    'annual_revenue': 75000000,
                    'year_established': 2012,
                    'size': 'large',
                    'credit_rating': 'AA',
                    'payment_terms': 'Net 60',
                    'travel_budget': 3000000,
                    'annual_travel_volume': '$3M annually',
                    'travel_frequency': 'Quarterly',
                    'preferred_class': 'Business/First',
                    'sustainability_focus': 'Very High',
                    'risk_level': 'Low',
                    'current_airlines': 'Southwest, United',
                    'expansion_plans': 'Aggressive',
                    'specialties': 'Solar Power, Wind Energy, Battery Storage, Grid Solutions',
                    'technology_integration': 'Smart Grid, IoT Monitoring, AI Optimization',
                    'description': 'Leading renewable energy company specializing in solar and wind power solutions for commercial and residential markets.'
                }
            ]

            # Create DataFrame
            df = pd.DataFrame(sample_data)

            # Create Excel file in memory
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Corporate Data Sample', index=False)

                # Get the workbook and worksheet to add some formatting
                workbook = writer.book
                worksheet = writer.sheets['Corporate Data Sample']

                # Auto-adjust column widths
                for col in worksheet.columns:
                    max_length = 0
                    column = col[0].column_letter
                    for cell in col:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)
                    worksheet.column_dimensions[column].width = adjusted_width

            output.seek(0)

        # Create response
        response = HttpResponse(
            output.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="corporate_data_sample_{datetime.now().strftime("%Y%m%d")}.xlsx"'

        return response

    except Exception as e:
        return Response(
            {'error': f'Failed to generate sample file: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET', 'POST'])
def lead_stats(request):
    """Get comprehensive lead statistics for dashboard"""
    try:
        # Parse the request body for POST or query params for GET
        if request.method == 'POST':
            data = request.data if hasattr(request, 'data') else {}
        else:
            data = request.GET
        date_range = data.get('dateRange', 'all_time')

        # Calculate date ranges based on the requested period
        now = timezone.now()
        period_start = None
        period_end = now

        if date_range == 'last_month':
            current_month_start = now.replace(day=1)
            last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
            last_month_end = current_month_start - timedelta(days=1)
            period_start = last_month_start
            period_end = last_month_end
        elif date_range == 'last_week':
            period_start = now - timedelta(days=7)
        elif date_range == 'last_30_days':
            period_start = now - timedelta(days=30)
        elif date_range == 'this_month':
            period_start = now.replace(day=1)
        elif date_range == 'this_year':
            period_start = now.replace(month=1, day=1)
        # If date_range is 'all_time' or any other value, don't filter by date

        # Basic counts - use date filter if specified
        if period_start:
            total_leads = Lead.objects.filter(
                created_at__gte=period_start,
                created_at__lte=period_end
            ).count()
            qualified_leads = Lead.objects.filter(
                status='qualified',
                created_at__gte=period_start,
                created_at__lte=period_end
            ).count()
            unqualified_leads = Lead.objects.filter(
                status='unqualified',
                created_at__gte=period_start,
                created_at__lte=period_end
            ).count()
            contacted_leads = Lead.objects.filter(
                status__in=['contacted', 'qualified', 'unqualified'],
                created_at__gte=period_start,
                created_at__lte=period_end
            ).count()
        else:
            # All time data
            total_leads = Lead.objects.count()
            qualified_leads = Lead.objects.filter(status='qualified').count()
            unqualified_leads = Lead.objects.filter(status='unqualified').count()
            contacted_leads = Lead.objects.filter(status__in=['contacted', 'qualified', 'unqualified']).count()

        # Calculate percentage change (comparing current period to previous period)
        total_change = 0
        if period_start:
            period_duration = period_end - period_start
            previous_period_start = period_start - period_duration
            previous_period_end = period_start

            previous_period_leads = Lead.objects.filter(
                created_at__gte=previous_period_start,
                created_at__lte=previous_period_end
            ).count()

            if previous_period_leads > 0:
                total_change = ((total_leads - previous_period_leads) / previous_period_leads) * 100

        # Calculate progress statuses
        responded_leads = Lead.objects.filter(status__in=['qualified', 'unqualified']).count()

        # Calculate conversion rate
        conversion_rate = (qualified_leads / total_leads * 100) if total_leads > 0 else 0

        # Email metrics calculation
        email_campaigns = EmailCampaign.objects.filter(status__in=['active', 'completed'])
        if email_campaigns.exists():
            total_sent = sum(campaign.emails_sent for campaign in email_campaigns)
            total_opened = sum(campaign.emails_opened for campaign in email_campaigns)
            email_open_rate = (total_opened / total_sent * 100) if total_sent > 0 else 0

            # Calculate change from last campaign
            last_two_campaigns = email_campaigns.order_by('-created_at')[:2]
            if len(last_two_campaigns) >= 2:
                current_rate = (last_two_campaigns[0].emails_opened / last_two_campaigns[0].emails_sent * 100) if last_two_campaigns[0].emails_sent > 0 else 0
                previous_rate = (last_two_campaigns[1].emails_opened / last_two_campaigns[1].emails_sent * 100) if last_two_campaigns[1].emails_sent > 0 else 0
                email_open_rate_change = current_rate - previous_rate
            else:
                email_open_rate_change = 0
        else:
            email_open_rate = 0
            email_open_rate_change = 0

        # Calculate average response time
        responded_leads_with_history = Lead.objects.filter(
            status__in=['qualified', 'unqualified']
        ).exclude(created_at=None, updated_at=None)

        if responded_leads_with_history.exists():
            total_response_time = 0
            count = 0
            for lead in responded_leads_with_history:
                time_diff = lead.updated_at - lead.created_at
                total_response_time += time_diff.total_seconds()
                count += 1

            avg_seconds = total_response_time / count if count > 0 else 0
            avg_hours = avg_seconds / 3600

            if avg_hours < 1:
                avg_response_time = f"{int(avg_seconds / 60)} minutes"
            elif avg_hours < 24:
                avg_response_time = f"{avg_hours:.1f} hours"
            else:
                avg_response_time = f"{avg_hours / 24:.1f} days"

            # Calculate improvement (comparing to previous period if available)
            avg_response_time_change = "0% change"
            if period_start:
                previous_responded_leads = Lead.objects.filter(
                    status__in=['qualified', 'unqualified'],
                    created_at__gte=previous_period_start,
                    created_at__lte=previous_period_end
                ).exclude(created_at=None, updated_at=None)

                if previous_responded_leads.exists():
                    prev_total_time = sum((lead.updated_at - lead.created_at).total_seconds() for lead in previous_responded_leads)
                    prev_avg_seconds = prev_total_time / previous_responded_leads.count()

                    if prev_avg_seconds > 0:
                        change_percent = ((prev_avg_seconds - avg_seconds) / prev_avg_seconds) * 100
                        if change_percent > 0:
                            avg_response_time_change = f"{change_percent:.1f}% faster"
                        else:
                            avg_response_time_change = f"{abs(change_percent):.1f}% slower"
        else:
            avg_response_time = "No data"
            avg_response_time_change = "No data"

        return Response({
            'totalLeads': total_leads,
            'totalChange': round(total_change, 1),
            'qualifiedLeads': qualified_leads,
            'unqualified': unqualified_leads,
            'contacted': contacted_leads,
            'responded': responded_leads,
            'conversionRate': round(conversion_rate, 1),
            'avgResponseTime': avg_response_time,
            'avgResponseTimeChange': avg_response_time_change,
            'emailOpenRate': round(email_open_rate, 1),
            'emailOpenRateChange': round(email_open_rate_change, 1)
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def recent_activity(request):
    """Get recent lead activity"""
    try:
        # Get recent history entries (if table exists)
        recent_activities = []

        try:
            # Try to get from LeadHistory model
            recent_history = LeadHistory.objects.select_related('lead').order_by('-timestamp')[:10]

            for history in recent_history:
                activity_type = 'qualification' if 'qualified' in history.action.lower() else \
                              'disqualification' if 'disqualified' in history.action.lower() else \
                              'email' if 'email' in history.action.lower() else \
                              'response'

                recent_activities.append({
                    'id': history.id,
                    'type': activity_type,
                    'lead': f"{history.lead.company.name}",
                    'action': history.action,
                    'time': history.timestamp.strftime('%d %b %Y, %I:%M %p'),
                    'status': history.lead.status,
                    'value': f"Score: {history.lead.score}" if history.lead.score else "No score"
                })
        except:
            # Fallback to recent leads if history table doesn't exist
            recent_leads = Lead.objects.select_related('company').order_by('-updated_at')[:5]

            for i, lead in enumerate(recent_leads):
                recent_activities.append({
                    'id': lead.id,
                    'type': 'qualification' if lead.status == 'qualified' else 'response',
                    'lead': lead.company.name,
                    'action': f'Lead {lead.status} - Recent update',
                    'time': lead.updated_at.strftime('%d %b %Y, %I:%M %p'),
                    'status': lead.status,
                    'value': f"${lead.estimated_value:,.0f} potential" if lead.estimated_value else "No value set"
                })

        # If no activities found, return empty list
        if not recent_activities:
            return Response([])

        return Response(recent_activities)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def lead_pipeline_stats(request):
    """Get lead pipeline statistics"""
    try:
        stats = {}
        total_leads = Lead.objects.count()

        for status, status_label in Lead.LEAD_STATUS_CHOICES:
            count = Lead.objects.filter(status=status).count()
            stats[status] = {
                'count': count,
                'label': status_label,
                'percentage': (count / total_leads * 100) if total_leads > 0 else 0
            }

        stats['summary'] = {
            'total_leads': total_leads,
            'qualified_leads': Lead.objects.filter(status='qualified').count(),
            'unqualified_leads': Lead.objects.filter(status='unqualified').count(),
            'active_leads': Lead.objects.filter(status__in=['new', 'contacted', 'qualified']).count(),
            'conversion_rate': (Lead.objects.filter(status='won').count() / max(Lead.objects.count(), 1)) * 100 if total_leads > 0 else 0
        }

        return Response(stats)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def top_leads(request):
    """Get top qualified leads for dashboard"""
    try:
        # Get top qualified leads ordered by score and estimated value
        top_qualified_leads = Lead.objects.filter(
            status__in=['qualified', 'contacted']
        ).select_related('company', 'contact').order_by('-score', '-estimated_value')[:5]

        leads_data = []
        for lead in top_qualified_leads:
            # Calculate engagement level based on score
            if lead.score >= 80:
                engagement = 'High'
            elif lead.score >= 60:
                engagement = 'Medium'
            else:
                engagement = 'Low'

            # Determine next action based on status and priority
            if lead.status == 'qualified':
                next_action = 'Send proposal'
            elif lead.status == 'contacted':
                next_action = 'Follow up call'
            else:
                next_action = 'Contact prospect'

            # Format last contact time
            time_since_update = timezone.now() - lead.updated_at
            if time_since_update.days > 0:
                last_contact = f"{time_since_update.days} days ago"
            elif time_since_update.seconds > 3600:
                last_contact = f"{time_since_update.seconds // 3600} hours ago"
            else:
                last_contact = f"{time_since_update.seconds // 60} minutes ago"

            leads_data.append({
                'id': lead.id,
                'company': lead.company.name,
                'contact': f"{lead.contact.first_name} {lead.contact.last_name}",
                'title': lead.contact.position or 'Contact',
                'industry': lead.company.industry,
                'employees': lead.company.employee_count or 100,
                'engagement': engagement,
                'status': lead.status,
                'score': lead.score,
                'value': f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else "TBD",
                'nextAction': next_action,
                'lastContact': last_contact
            })

        # If no leads found, return empty list
        if not leads_data:
            return Response([])

        return Response(leads_data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# New CampaignTemplate and EmailCampaign API Views
class CampaignTemplateViewSet(viewsets.ModelViewSet):
    queryset = CampaignTemplate.objects.all()
    serializer_class = CampaignTemplateSerializer

    def list(self, request, *args, **kwargs):
        """Get all templates including both custom and default templates"""
        # Get custom templates from database
        custom_templates_response = super().list(request, *args, **kwargs)

        # Extract the actual list from the response data
        if hasattr(custom_templates_response, 'data'):
            custom_templates_data = custom_templates_response.data
            # Handle both paginated (OrderedDict) and non-paginated (list) responses
            if isinstance(custom_templates_data, dict) and 'results' in custom_templates_data:
                custom_templates = custom_templates_data['results']
            elif isinstance(custom_templates_data, list):
                custom_templates = custom_templates_data
            else:
                custom_templates = []
        else:
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

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
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