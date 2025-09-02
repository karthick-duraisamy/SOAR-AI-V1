from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, ContactViewSet, LeadViewSet, OpportunityViewSet,
    OpportunityActivityViewSet, ContractViewSet, ContractBreachViewSet,
    EmailCampaignViewSet, TravelOfferViewSet, SupportTicketViewSet,
    RevenueForecastViewSet, ActivityLogViewSet, LeadNoteViewSet,
    LeadHistoryViewSet, AIConversationViewSet,
    send_corporate_message, check_smtp_status, download_proposal_attachment,
    track_email_open, track_email_click, campaign_analytics
)

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'leads', views.LeadViewSet)
router.register(r'opportunities', views.OpportunityViewSet)
router.register(r'opportunity-activities', views.OpportunityActivityViewSet)
router.register(r'contracts', views.ContractViewSet)
router.register(r'contract-breaches', views.ContractBreachViewSet)
router.register(r'email-campaigns', views.EmailCampaignViewSet)
router.register(r'travel-offers', views.TravelOfferViewSet)
router.register(r'support-tickets', views.SupportTicketViewSet)
router.register(r'revenue-forecasts', views.RevenueForecastViewSet)
router.register(r'activity-logs', views.ActivityLogViewSet)
router.register(r'ai-conversations', views.AIConversationViewSet)
router.register(r'lead-notes', views.LeadNoteViewSet)
router.register(r'lead-history', views.LeadHistoryViewSet)
router.register(r'campaign-templates', views.CampaignTemplateViewSet)
router.register(r'dashboard', views.DashboardAPIView, basename='dashboard')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Custom lead dashboard endpoints
    path('leads/stats/', views.lead_stats, name='lead_stats'),
    path('leads/recent-activity/', views.recent_activity, name='recent_activity'),
    path('leads/top-leads/', views.top_leads, name='top_leads'),

    # Company bulk operations
    path('companies/bulk-upload/', views.bulk_upload_companies, name='bulk_upload_companies'),
    path('companies/download-sample/', views.download_sample_excel, name='download_sample_excel'),

    # SMTP status endpoints
    path('email-campaigns/smtp-status/', views.check_smtp_status, name='check_smtp_status'),
    path('email-campaigns/<int:campaign_id>/smtp-status/', views.check_smtp_status, name='check_campaign_smtp_status'),

    # Email campaign performance tracking
    path('email-campaigns/performance/', views.email_campaign_performance, name='email_campaign_performance'),
    path('email-campaigns/<int:campaign_id>/track-open/', views.track_email_open, name='track_email_open'),
    path('email-campaigns/<int:campaign_id>/track-click/', views.track_email_click, name='track_email_click'),

    # Corporate message sending
    path('leads/send_message/', views.send_corporate_message, name='send_corporate_message'),
    path('send-corporate-message/', views.send_corporate_message, name='send_corporate_message'),

    # Proposal Draft Management
    path('opportunities/<int:opportunity_id>/proposal-draft/', views.proposal_draft_detail, name='proposal-draft-detail'),
    path('opportunities/<int:opportunity_id>/proposal-draft/attachment/', views.download_proposal_attachment, name='proposal-draft-attachment'),
    path('proposal-attachment/<int:opportunity_id>/', views.download_proposal_attachment, name='download_proposal_attachment'),

    # Generic history endpoint
    path('get-history/', views.get_history, name='get_history'),
]