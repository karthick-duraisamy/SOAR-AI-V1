from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, ContactViewSet, LeadViewSet, OpportunityViewSet,
    OpportunityActivityViewSet, ContractViewSet, ContractBreachViewSet,
    CampaignTemplateViewSet, EmailCampaignViewSet, recent_lead_activity, top_qualified_leads,
    lead_dashboard_stats, list_revenue_files, delete_revenue_file, upload_revenue_data,
    proposal_draft_detail, campaign_analytics, get_history
)

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'leads', views.LeadViewSet)
router.register(r'opportunities', views.OpportunityViewSet)
router.register(r'opportunity-activities', views.OpportunityActivityViewSet)
router.register(r'contracts', views.ContractViewSet)
router.register(r'contract-breaches', views.ContractBreachViewSet)
router.register(r'email-campaigns', views.EmailCampaignViewSet, basename='emailcampaign')
router.register(r'travel-offers', views.TravelOfferViewSet)
router.register(r'support-tickets', views.SupportTicketViewSet)
router.register(r'revenue-forecasts', views.RevenueForecastViewSet)
router.register(r'activity-logs', views.ActivityLogViewSet)
router.register(r'ai-conversations', views.AIConversationViewSet)
router.register(r'lead-notes', views.LeadNoteViewSet)
router.register(r'lead-history', views.LeadHistoryViewSet)
router.register(r'campaign-templates', views.CampaignTemplateViewSet)
router.register(r'proposal-drafts', views.ProposalDraftViewSet)
router.register(r'campaigns', views.EmailCampaignViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Custom lead dashboard endpoints
    path('leads/dashboard/stats/', lead_dashboard_stats, name='lead_dashboard_stats'),
    path('leads/dashboard/recent-activity/', recent_lead_activity, name='recent_activity'),
    path('leads/dashboard/top-qualified/', top_qualified_leads, name='top_qualified_leads'),

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
    path('opportunities/<int:opportunity_id>/proposal-draft/', proposal_draft_detail, name='proposal-draft-detail'),
    path('opportunities/<int:opportunity_id>/proposal-draft/attachment/', views.download_proposal_attachment, name='proposal-draft-attachment'),
    path('proposal-attachment/<int:opportunity_id>/', views.download_proposal_attachment, name='download_proposal_attachment'),

    # Revenue data upload endpoint
    # Revenue data management
    path('upload-revenue-data/', upload_revenue_data, name='upload_revenue_data'),
    path('list-revenue-files/', list_revenue_files, name='list_revenue_files'),
    path('delete-revenue-file/<str:filename>/', delete_revenue_file, name='delete_revenue_file'),
    # Generic history endpoint
    path('get-history/', get_history, name='get_history'),

    # Email tracking endpoints
    path('email-tracking/open/<uuid:tracking_id>/', views.track_email_open_pixel, name='track_email_open_pixel'),
    path('email-tracking/click/<uuid:tracking_id>/', views.track_email_click_redirect, name='track_email_click_redirect'),
]