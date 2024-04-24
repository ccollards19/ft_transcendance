import asyncio
import random

from django.http import StreamingHttpResponse
from django.shortcuts import render


async def sse_stream(request):
    """
    Sends server-sent events to the client.
    """
    async def event_stream():
        q = ["q", "w", "e", "r", "t", "y"]
        i = 0
        while True:
            yield f'data: {random.choice(q)} {i}\n\n'
            i += 1
            await asyncio.sleep(5)

    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})
