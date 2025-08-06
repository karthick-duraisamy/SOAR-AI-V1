
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    Company, Contact, Lead, Opportunity, Contract, Vendor,
    MarketingCampaign, SupportTicket, RevenueForecast, ActivityLog
)
from .serializers import (
    CompanySerializer, ContactSerializer, LeadSerializer, OpportunitySerializer,
    ContractSerializer, VendorSerializer, MarketingCampaignSerializer,
    SupportTicketSerializer, RevenueForecastSerializer, ActivityLogSerializer
)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        industry = request.query_params.get('industry', '')
        size = request.query_params.get('size', '')
        
        companies = self.queryset
        
        if query:
            companies = companies.filter(
                Q(name__icontains=query) | 
                Q(location__icontains=query)
            )
        
        if industry:
            companies = companies.filter(industry=industry)
        
        if size:
            companies = companies.filter(size=size)
        
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    @action(detail=False, methods=['get'])
    def pipeline_stats(self, request):
        stats = {}
        for status, _ in Lead.LEAD_STATUS_CHOICES:
            stats[status] = self.queryset.filter(status=status).count()
        
        return Response(stats)

    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        lead = self.get_object()
        score = request.data.get('score', 0)
        lead.score = score
        lead.save()
        
        return Response({'status': 'score updated', 'new_score': lead.score})

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer

    @action(detail=False, methods=['get'])
    def pipeline_value(self, request):
        pipeline = {}
        for stage, _ in Opportunity.OPPORTUNITY_STAGES:
            opportunities = self.queryset.filter(stage=stage)
            pipeline[stage] = {
                'count': opportunities.count(),
                'total_value': sum(opp.value for opp in opportunities),
                'weighted_value': sum(opp.value * opp.probability / 100 for opp in opportunities)
            }
        
        return Response(pipeline)

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

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        service_type = request.query_params.get('service_type', '')
        location = request.query_params.get('location', '')
        min_rating = request.query_params.get('min_rating', '')
        
        vendors = self.queryset
        
        if service_type:
            vendors = vendors.filter(service_type__icontains=service_type)
        
        if location:
            vendors = vendors.filter(location__icontains=location)
        
        if min_rating:
            vendors = vendors.filter(rating__gte=float(min_rating))
        
        serializer = self.get_serializer(vendors, many=True)
        return Response(serializer.data)

class MarketingCampaignViewSet(viewsets.ModelViewSet):
    queryset = MarketingCampaign.objects.all()
    serializer_class = MarketingCampaignSerializer

    @action(detail=False, methods=['get'])
    def performance(self, request):
        campaigns = self.queryset.filter(status__in=['active', 'completed'])
        
        performance_data = []
        for campaign in campaigns:
            performance_data.append({
                'name': campaign.name,
                'budget': campaign.budget,
                'metrics': campaign.metrics,
                'roi': campaign.metrics.get('roi', 0) if campaign.metrics else 0
            })
        
        return Response(performance_data)

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        stats = {
            'total_open': self.queryset.filter(status__in=['open', 'in_progress']).count(),
            'high_priority': self.queryset.filter(priority='high', status__in=['open', 'in_progress']).count(),
            'avg_resolution_time': 2.5,  # Calculate actual average
            'satisfaction_score': 4.2
        }
        return Response(stats)

class RevenueForecastViewSet(viewsets.ModelViewSet):
    queryset = RevenueForecast.objects.all()
    serializer_class = RevenueForecastSerializer

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
