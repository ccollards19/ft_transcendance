devup : devreq
	docker compose up -d
	. .venv/bin/activate ; python3 transcendence/manage.py migrate	
	. .venv/bin/activate ; python3 transcendence/manage.py runserver	
devdown : 
	docker compose down

devreq : .venv requirements.txt

requirements.txt : .venv
	. .venv/bin/activate ; pip install -r requirements.txt
.venv :
	python3 -m venv .venv
./db :
	docker compose build
	docker run db -d
prod :
	docker compose up --build -d
down :
	docker compose down
up :
	docker compose up -d
dockerclean:
	docker rm `sudo docker ps -aq` || true
	docker image rm `sudo docker image ls -q` || true 
	docker system prune -f || true
clean : dockerclean

prune : clean
	rm -rf db || true
	rm -rf .venv || true

.PHONY : prod up down back devup devdown clean dockerclean prune
