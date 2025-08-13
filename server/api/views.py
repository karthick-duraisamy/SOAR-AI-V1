from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast,
    ActivityLog, AIConversation, LeadNote, LeadHistory
)
from .serializers import (
    CompanySerializer, ContactSerializer, LeadSerializer, OpportunitySerializer,
    ContractSerializer, ContractBreachSerializer, EmailCampaignSerializer,
    TravelOfferSerializer, SupportTicketSerializer, RevenueForecastSerializer,
    ActivityLogSerializer, AIConversationSerializer, LeadNoteSerializer, LeadHistorySerializer
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

        search = filters.get('search', '')
        status = filters.get('status', '')
        industry = filters.get('industry', '')
        score = filters.get('score', '')
        engagement = filters.get('engagement', '')

        if search:
            queryset = queryset.filter(
                Q(company__name__icontains=search) |
                Q(contact__first_name__icontains=search) |
                Q(contact__last_name__icontains=search) |
                Q(contact__email__icontains=search)
            )

        if status and status != 'all':
            queryset = queryset.filter(status=status)

        if industry and industry != 'all':
            queryset = queryset.filter(company__industry=industry)

        if score and score != 'all':
            if score == 'high':
                queryset = queryset.filter(score__gte=80)
            elif score == 'medium':
                queryset = queryset.filter(score__gte=60, score__lt=80)
            elif score == 'low':
                queryset = queryset.filter(score__lt=60)

        # Add engagement filter logic if needed
        if engagement and engagement != 'all':
            if engagement == 'High':
                queryset = queryset.filter(score__gte=80)
            elif engagement == 'Medium':
                queryset = queryset.filter(score__gte=60, score__lt=80)
            elif engagement == 'Low':
                queryset = queryset.filter(score__lt=60)

        # Order and limit for performance
        queryset = queryset.order_by('-created_at')[:100]  # Limit to 100 results for performance

        # Use optimized serializer for better performance
        from .serializers import OptimizedLeadSerializer
        serializer = OptimizedLeadSerializer(queryset, many=True)
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
                estimated_close_date=opportunity_data.get('expectedCloseDate',
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

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer

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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Lead, Company, Contact, LeadNote, LeadHistory
from .serializers import LeadSerializer, CompanySerializer, ContactSerializer
import json

@api_view(['POST'])
def lead_pipeline_stats(request):
    """Get lead pipeline statistics"""
    try:
        # Get count of leads by status
        total_leads = Lead.objects.count()
        qualified_leads = Lead.objects.filter(status='qualified').count()
        unqualified_leads = Lead.objects.filter(status='unqualified').count()
        new_leads = Lead.objects.filter(status='new').count()
        contacted_leads = Lead.objects.filter(status='contacted').count()

        # Calculate conversion rate
        conversion_rate = (qualified_leads / total_leads * 100) if total_leads > 0 else 0

        # Get average score
        avg_score = Lead.objects.aggregate(avg_score=Avg('score'))['avg_score'] or 0

        return Response({
            'total_leads': total_leads,
            'qualified_leads': qualified_leads,
            'unqualified_leads': unqualified_leads,
            'new_leads': new_leads,
            'contacted_leads': contacted_leads,
            'conversion_rate': round(conversion_rate, 2),
            'average_score': round(avg_score, 2)
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['GET'])
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

        return Response(recent_activities)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
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

        return Response(leads_data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )