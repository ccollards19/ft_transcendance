DB_DEV = ./db
DB_PROD = ./db_prod

devup : devreq
	pg_ctl -D $(DB_DEV) -l logfile_dev start
devdown : 
	pg_ctl -D $(DB_DEV) stop
devreq : .venv db requirements.txt

requirements.txt : .venv
	. .venv/bin/activate ; pip install -r requirements.txt
.venv :
	python3 venv .venv
$(DB_DEV) :
	brew install postgresql@14
	initdb -D ./db
prod :
	docker compose up --build -d
down :
	docker compose down
up :
	docker compose up -d
dockerclean:
	docker rm `sudo docker ps -aq`
	docker image rm `sudo docker image ls -q`
	docker system prune -f
clean : dockerclean

prune : clean
	rm -rf db	
	rm -rf db_prod	
	rm -rf logfile
	rm -rf .venv

.PHONY : prod up down back devup devdown clean dockerclean prune
