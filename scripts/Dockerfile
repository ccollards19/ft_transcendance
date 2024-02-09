FROM python:3

WORKDIR /usr/src/app

COPY requirements/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY transcendence .
COPY scripts/django_launch.sh .
COPY scripts/check_db.py .
