from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include('api.urls')),
    path('authenticate/', include('authenticate.urls')),
    path('game/', include('game.urls')),
    path('tournaments/', include('tournaments.urls')),
    path('profiles/', include('profiles.urls'))
    # path('images/', include('images.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT)
