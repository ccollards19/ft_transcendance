devup : devreq
	docker compose up -d db 
	source .venv/bin/activate ;\
	python3 transcendence/manage.py runserver	
devdown : 
	docker compose down
devreq : .venv requirements.txt ./db
	source .venv/bin/activate ;\
	sleep 10;\
	sudo python3 transcendence/manage.py makemigrations;\
	sudo python3 transcendence/manage.py migrate
requirements.txt : .venv
	source .venv/bin/activate ;\
	pip install -r requirements.txt
.venv :
	python3 -m venv .venv
./db :
	docker compose up --build -d db
dockerclean:
	docker stop db || true
	docker rm `sudo docker ps -aq` || true
	docker image rm `sudo docker image ls -q` || true 
	docker system prune -f || true
clean : dockerclean
prune : clean
	rm -rf db || true
	rm -rf .venv || true
.PHONY : prod up down back devup devdown clean dockerclean prune
