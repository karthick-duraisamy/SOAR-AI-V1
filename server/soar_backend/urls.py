from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_info(request):
    return JsonResponse({
        'message': 'SOAR Backend API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'companies': '/api/companies/',
            'contacts': '/api/contacts/',
            'leads': '/api/leads/',
            'opportunities': '/api/opportunities/',
            'contracts': '/api/contracts/',
        }
    })

urlpatterns = [
    path('', api_info, name='api_info'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]