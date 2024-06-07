# Generated by Django 5.0.2 on 2024-05-29 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_rename_loser_match_player2_match_player1_and_more'),
        ('profiles', '0016_alter_profile_matches'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='matches',
            field=models.ManyToManyField(blank=True, related_name='matches', to='game.match'),
        ),
    ]
