# Generated by Django 5.0.2 on 2024-05-27 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0012_rename_loses_chess_stats_losses_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='defaultGame',
            field=models.CharField(default='pong', max_length=5),
        ),
    ]
