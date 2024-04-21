import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from chat.consumers import ChatConsumer
from chat.routing import chat_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(chat_urlpatterns))
        ),
        # to be used if need microservice module
        # "channel": ChannelNameRouter({
        #     "chat": ChatConsumer.as_asgi(),
        #     "home": HomeConsumer.as_asgi(),
        #     "profile": ProfileConsumer.as_asgi(),
        #     }
        # ), 
    }
)

