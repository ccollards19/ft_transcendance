from django.urls import include, path
from authenticate.views import sign_in_view, sign_out_view, sign_up_view, resign_view

urlpatterns = [
    path("sign_in/", sign_in_view),
    path("sign_out/",    sign_out_view),
    path("sign_up/", sign_up_view),
    path("resign/",      resign_view),
] 
