# Generated by Django 5.0.2 on 2024-06-06 08:30

import django.contrib.postgres.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ball',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField(default=0)),
                ('y', models.IntegerField(default=0)),
                ('angle', models.IntegerField(default=0)),
                ('speed', models.IntegerField(default=5)),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Paddle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('P1', models.IntegerField(default=1)),
                ('P2', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('P1', models.IntegerField(default=0)),
                ('P2', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='GameState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fen', models.CharField(default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1', max_length=255)),
                ('moves', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=500), blank=True, null=True, size=None)),
                ('turn', models.BooleanField(default=True, verbose_name=True)),
                ('kingpin', models.BooleanField(default=False, verbose_name=True)),
                ('checkmate', models.BooleanField(default=False, verbose_name=True)),
                ('promotion', models.CharField(max_length=10, null=True)),
                ('ball', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.ball')),
                ('paddle', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='game.paddle')),
                ('score', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='game.score')),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='pong', max_length=100)),
                ('state', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='game.gamestate')),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1Ready', models.BooleanField(default=False)),
                ('player2Ready', models.BooleanField(default=False)),
                ('player1Replay', models.BooleanField(default=None, null=True)),
                ('player2Replay', models.BooleanField(default=None, null=True)),
                ('spectate', models.BooleanField(default=True)),
                ('cancelled', models.BooleanField(default=False)),
                ('game', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
            ],
        ),
    ]
