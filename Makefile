dev : 
	docker compose up --build 
up : 
	docker compose up 
down : 
	docker compose down
dockerclean:
	docker stop db || true
	docker rm `docker ps -aq` || true
	docker image rm `docker image ls -q` || true 
	docker system prune -f || true
clean : dockerclean
prune : clean
	rm -rf db || true
	rm -rf .venv || true
.PHONY : prod up down back devup devdown clean dockerclean prune
