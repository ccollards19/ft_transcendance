#!/bin/sh

cd backend && python manage.py makemigrations && python manage.py migrate
