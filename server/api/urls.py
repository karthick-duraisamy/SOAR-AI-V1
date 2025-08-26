from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, ContactViewSet, LeadViewSet, OpportunityViewSet, OpportunityActivityViewSet,
    ContractViewSet, ContractBreachViewSet, EmailCampaignViewSet,
    TravelOfferViewSet, SupportTicketViewSet, RevenueForecastViewSet,
    ActivityLogViewSet, AIConversationViewSet, LeadNoteViewSet, LeadHistoryViewSet,
    DashboardAPIView, lead_stats, recent_activity, top_leads, bulk_upload_companies, download_sample_excel, CampaignTemplateViewSet
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'opportunities', OpportunityViewSet)
router.register(r'opportunity-activities', OpportunityActivityViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'contract-breaches', ContractBreachViewSet)
router.register(r'email-campaigns', EmailCampaignViewSet)
router.register(r'travel-offers', TravelOfferViewSet)
router.register(r'support-tickets', SupportTicketViewSet)
router.register(r'revenue-forecasts', RevenueForecastViewSet)
router.register(r'activity-logs', ActivityLogViewSet)
router.register(r'lead-notes', LeadNoteViewSet)
router.register(r'lead-history', LeadHistoryViewSet)
router.register(r'ai-conversations', AIConversationViewSet)
router.register(r'campaign-templates', CampaignTemplateViewSet)
router.register(r'dashboard', DashboardAPIView, basename='dashboard')

urlpatterns = [
    # Custom lead dashboard endpoints (must come before router.urls to avoid conflicts)
    path('leads/stats/', lead_stats, name='lead_stats'),
    path('leads/recent-activity/', recent_activity, name='recent_activity'),
    path('leads/top-leads/', top_leads, name='top_leads'),
    path('companies/bulk-upload/', bulk_upload_companies, name='bulk_upload_companies'),
    path('companies/download-sample/', download_sample_excel, name='download_sample_excel'),
    path('', include(router.urls)),
]