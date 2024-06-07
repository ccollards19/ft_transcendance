# Generated by Django 5.0.2 on 2024-04-24 10:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Accounts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avatar', models.CharField(default='default_avatar.jpeg', max_length=1000)),
                ('bio', models.CharField(default='', max_length=10000)),
                ('catchphrase', models.CharField(default='', max_length=10000)),
                ('status', models.CharField(default='online', max_length=10000)),
                ('match', models.IntegerField(default=0)),
                ('challengeable', models.BooleanField(default=False)),
                ('playing', models.BooleanField(default=False)),
                ('blocked', models.ManyToManyField(blank=True, to='api.accounts')),
                ('friends', models.ManyToManyField(blank=True, to='api.accounts')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Chess_stats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.CharField(choices=[('default', 'pirate-symbol-mark-svgrepo-com.svg')], default='pirate-symbol-mark-svgrepo-com.svg')),
                ('matches', models.IntegerField(default=0)),
                ('wins', models.IntegerField(default=0)),
                ('loses', models.IntegerField(default=0)),
                ('challenged', models.ManyToManyField(related_name='chess_challenged', to='api.accounts')),
                ('challengers', models.ManyToManyField(related_name='chess_challengers', to='api.accounts')),
            ],
        ),
        migrations.AddField(
            model_name='accounts',
            name='chess_stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chess_stats', to='api.chess_stats'),
        ),
        migrations.CreateModel(
            name='Pong_stats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.CharField(choices=[('default', 'pirate-symbol-mark-svgrepo-com.svg')], default='pirate-symbol-mark-svgrepo-com.svg')),
                ('matches', models.IntegerField(default=0)),
                ('wins', models.IntegerField(default=0)),
                ('loses', models.IntegerField(default=0)),
                ('challenged', models.ManyToManyField(related_name='pong_challenged', to='api.accounts')),
                ('challengers', models.ManyToManyField(related_name='pong_challengers', to='api.accounts')),
            ],
        ),
        migrations.AddField(
            model_name='accounts',
            name='pong_stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pong_stats', to='api.pong_stats'),
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game', models.CharField(choices=[('c', 'Chess'), ('p', 'Pong')])),
                ('title', models.CharField(default='', max_length=1000)),
                ('picture', models.CharField(default='', max_length=1000)),
                ('organizer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.accounts')),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game', models.CharField(choices=[('c', 'Chess'), ('p', 'Pong')])),
                ('looser', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='player_b', to='api.accounts')),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='player_a', to='api.accounts')),
                ('tournament', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.tournament')),
            ],
        ),
        migrations.AddField(
            model_name='accounts',
            name='subscriptions',
            field=models.ManyToManyField(related_name='subscribed_tournaments', to='api.tournament'),
        ),
        migrations.AddField(
            model_name='accounts',
            name='tournaments',
            field=models.ManyToManyField(related_name='organised_tournaments', to='api.tournament'),
        ),
    ]
