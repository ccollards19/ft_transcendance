# Generated by Django 5.0.2 on 2024-05-23 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0003_rename_tournament_specifictournament'),
    ]

    operations = [
        migrations.RenameField(
            model_name='specifictournament',
            old_name='contenders',
            new_name='allContenders',
        ),
        migrations.AddField(
            model_name='specifictournament',
            name='history',
            field=models.ManyToManyField(blank=True, to='tournaments.specifictournament'),
        ),
        migrations.AddField(
            model_name='specifictournament',
            name='reasonForNoWinner',
            field=models.CharField(default='', max_length=100),
        ),
    ]
