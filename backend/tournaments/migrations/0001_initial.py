# Generated by Django 5.0.2 on 2024-05-28 10:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='sample_tournament', max_length=30)),
                ('game', models.CharField(default='pong', max_length=100)),
                ('picture', models.ImageField(blank=True, default=None, upload_to='')),
                ('background', models.ImageField(blank=True, default=None, upload_to='')),
                ('maxContenders', models.IntegerField(default=4)),
                ('description', models.CharField(default='', max_length=1000)),
                ('reasonForNoWinner', models.CharField(default='', max_length=100)),
                ('allContenders', models.ManyToManyField(blank=True, to='profiles.profile')),
                ('organizer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='organizer', to='profiles.profile')),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='winner', to='profiles.profile')),
            ],
        ),
    ]
