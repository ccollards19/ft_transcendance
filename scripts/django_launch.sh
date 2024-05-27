python3 check_db.py;
python3 backend/manage.py makemigrations api;
python3 backend/manage.py makemigrations profile;
python3 backend/manage.py makemigrations authenticate;
python3 backend/manage.py makemigrations game;
python3 backend/manage.py makemigrations tournaments;
python3 backend/manage.py makemigrations;
python3 backend/manage.py migrate;
python3 backend/manage.py runserver 0.0.0.0:8000;
# cd backend && daphne -b 0.0.0.0 -p 8000 backend.asgi:application
# daphne -e ssl:8000:privateKey=/usr/src/app/django.key:certKey=/usr/src/app/django.crt backend.asgi:application"

