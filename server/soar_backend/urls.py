from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'SOAR Backend API',
        'version': '1.0',
        'endpoints': {
            'companies': '/api/companies/',
            'companies_search': '/api/companies/search/',
            'contacts': '/api/contacts/',
            'leads': '/api/leads/',
            'opportunities': '/api/opportunities/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', api_root),
]