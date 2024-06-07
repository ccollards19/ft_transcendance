# Generated by Django 5.0.2 on 2024-05-29 18:44

import profiles.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_rename_loser_match_player2_match_player1_and_more'),
        ('profiles', '0015_alter_profile_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='matches',
            field=profiles.models.MatchField(blank=True, related_name='matches', to='game.match'),
        ),
    ]
