from django.db import models
from django.contrib.auth.models import User

GAME = {
    "c": "Chess",
    "p": "Pong"
}

class MatchmakingQueue(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.CharField(choices=GAME.items(), max_length=1)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_game_display()}"
