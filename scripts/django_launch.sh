python3 check_db.py;
python3 backend/manage.py makemigrations api;
python3 backend/manage.py makemigrations authenticate;
python3 backend/manage.py makemigrations game;
python3 backend/manage.py makemigrations;
python3 backend/manage.py migrate;
python3 backend/manage.py runserver 0.0.0.0:8000;
