class Tournament(models.Model):
    game = models.CharField(choices=GAME)
    title = models.CharField(max_length=1000, default="")
    picture = models.CharField(max_length=1000, default="")
    organizer = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, choices=[("created", "Created"), ("ongoing", "Ongoing"), ("finished", "Finished")], default="created")
    winner = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL)
    maxContenders = models.IntegerField()
    matches =  models.ManyToManyField("Match", related_name="tournament_matches")


    def __str__(self):
        return self.title

class TournamentParticipant(models.Model):
    tournament = models.ForeignKey("Tournament", on_delete=models.CASCADE)
    participant = models.ForeignKey("Accounts", on_delete=models.CASCADE)
    # You can add more fields here like current score, status, etc.

class TournamentMatch(models.Model):
    tournament = models.ForeignKey("Tournament", on_delete=models.CASCADE)
    player1 = models.ForeignKey("Accounts", on_delete=models.CASCADE, related_name="match_player1")
    player2 = models.ForeignKey("Accounts", on_delete=models.CASCADE, related_name="match_player2")
    winner = models.ForeignKey("Accounts", null=True, blank=True, on_delete=models.SET_NULL)
    # You can add more fields like start time, end time, etc.