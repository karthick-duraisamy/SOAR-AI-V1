
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast, 
    ActivityLog, AIConversation
)
from .serializers import (
    CompanySerializer, ContactSerializer, LeadSerializer, OpportunitySerializer,
    ContractSerializer, ContractBreachSerializer, EmailCampaignSerializer,
    TravelOfferSerializer, SupportTicketSerializer, RevenueForecastSerializer, 
    ActivityLogSerializer, AIConversationSerializer
)

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
        
        # Advanced filters support
        industries = filters.get('industries', [])
        employee_range = filters.get('employeeRange', [])
        revenue_range = filters.get('revenueRange', '')
        credit_rating = filters.get('creditRating', '')
        sustainability_level = filters.get('sustainabilityLevel', '')
        preferred_class = filters.get('preferredClass', '')
        
        companies = self.queryset.filter(is_active=True)
        
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
    
    def get_queryset(self):
        queryset = self.queryset
        
        # Get query parameters
        search = self.request.query_params.get('search', None)
        status = self.request.query_params.get('status', None)
        industry = self.request.query_params.get('industry', None)
        score = self.request.query_params.get('score', None)
        
        # Apply filters
        if search:
            queryset = queryset.filter(
                Q(company__name__icontains=search) |
                Q(contact__first_name__icontains=search) |
                Q(contact__last_name__icontains=search) |
                Q(contact__email__icontains=search)
            )
        
        if status:
            queryset = queryset.filter(status=status)
            
        if industry:
            queryset = queryset.filter(company__industry=industry)
            
        if score:
            if score == 'high':
                queryset = queryset.filter(score__gte=80)
            elif score == 'medium':
                queryset = queryset.filter(score__gte=60, score__lt=80)
            elif score == 'low':
                queryset = queryset.filter(score__lt=60)
        
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
            'conversion_rate': (self.queryset.filter(status='won').count() / total_leads * 100) if total_leads > 0 else 0
        }
        
        return Response(stats)

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
        lead.score = score
        lead.save()
        
        return Response({'status': 'score updated', 'new_score': lead.score})

    @action(detail=True, methods=['post'])
    def qualify(self, request, pk=None):
        lead = self.get_object()
        lead.status = 'qualified'
        lead.save()
        
        return Response({'status': 'lead qualified'})

    @action(detail=True, methods=['post'])
    def disqualify(self, request, pk=None):
        lead = self.get_object()
        lead.status = 'unqualified'
        lead.notes = request.data.get('reason', lead.notes)
        lead.save()
        
        return Response({'status': 'lead disqualified'})

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
        return Response(serializer.data)

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
        return Response(serializer.data)

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

    @action(detail=False, methods=['get'])
    def recent_activity(self, request):
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        activities = self.queryset.filter(timestamp__gte=start_date)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

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
