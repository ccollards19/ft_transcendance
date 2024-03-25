python3 /check_db.py;
python3 /usr/src/app/backend/manage.py makemigrations;
python3 /usr/src/app/backend/manage.py migrate;
python3 /usr/src/app/backend/manage.py runserver 0.0.0.0:8000;
