# Generated by Django 5.0.2 on 2024-05-31 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0017_alter_profile_matches'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='MatchChannelName',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='profile',
            name='chatChannelName',
            field=models.CharField(default='', max_length=100),
        ),
    ]
