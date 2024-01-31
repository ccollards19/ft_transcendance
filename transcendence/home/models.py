from django.db import models

# Create your models here.

class Users(models.Model)
    pseudo = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    record = models.foreignKey
