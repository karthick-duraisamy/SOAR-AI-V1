
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, ContactViewSet, LeadViewSet, OpportunityViewSet,
    ContractViewSet, VendorViewSet, MarketingCampaignViewSet,
    SupportTicketViewSet, RevenueForecastViewSet, ActivityLogViewSet
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'opportunities', OpportunityViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'campaigns', MarketingCampaignViewSet)
router.register(r'tickets', SupportTicketViewSet)
router.register(r'forecasts', RevenueForecastViewSet)
router.register(r'activity-logs', ActivityLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
