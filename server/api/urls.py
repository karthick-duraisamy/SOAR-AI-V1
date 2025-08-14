from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'leads', views.LeadViewSet)
router.register(r'opportunities', views.OpportunityViewSet)
router.register(r'contracts', views.ContractViewSet)
router.register(r'contract-breaches', views.ContractBreachViewSet)
router.register(r'email-campaigns', views.EmailCampaignViewSet)
router.register(r'travel-offers', views.TravelOfferViewSet)
router.register(r'support-tickets', views.SupportTicketViewSet)
router.register(r'revenue-forecasts', views.RevenueForecastViewSet)
router.register(r'activity-logs', views.ActivityLogViewSet)
router.register(r'lead-notes', views.LeadNoteViewSet)
router.register(r'lead-history', views.LeadHistoryViewSet)
router.register(r'ai-conversations', views.AIConversationViewSet)
router.register(r'dashboard', views.DashboardAPIView, basename='dashboard')

urlpatterns = [
    # Custom lead dashboard endpoints (must come before router.urls to avoid conflicts)
    path('leads/stats/', views.lead_stats, name='lead_stats'),
    path('leads/recent-activity/', views.recent_activity, name='recent_activity'),
    path('leads/top-leads/', views.top_leads, name='top_leads'),
    path('leads/pipeline-stats/', views.lead_pipeline_stats, name='lead_pipeline_stats'),
    path('', include(router.urls)),
]