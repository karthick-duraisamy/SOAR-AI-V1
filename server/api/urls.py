from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, ContactViewSet, LeadViewSet, OpportunityViewSet,
    ContractViewSet, ContractBreachViewSet, EmailCampaignViewSet,
    TravelOfferViewSet, SupportTicketViewSet, RevenueForecastViewSet,
    ActivityLogViewSet, LeadNoteViewSet
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'opportunities', OpportunityViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'contract-breaches', ContractBreachViewSet)
router.register(r'email-campaigns', EmailCampaignViewSet)
router.register(r'travel-offers', TravelOfferViewSet)
router.register(r'support-tickets', SupportTicketViewSet)
router.register(r'revenue-forecasts', RevenueForecastViewSet)
router.register(r'activity-logs', ActivityLogViewSet)
router.register(r'ai-conversations', AIConversationViewSet)
router.register(r'dashboard', DashboardAPIView, basename='dashboard')
router.register(r'lead-notes', LeadNoteViewSet, basename='lead-note')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]