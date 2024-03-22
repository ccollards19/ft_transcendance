from django.urls import include, path


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    # path('api/', include('api.urls')),
    path('authenticate/', include('authenticate.urls')),
    # path('game/', include('game.urls')),
    # path('chat/', include('chat.urls')),
]

