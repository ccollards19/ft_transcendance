up : 
	docker compose up 
dev : 
	docker compose up --build 
down : 
	docker compose down
dockerclean:
	docker stop db || true
	docker rm `docker ps -aq` || true
	docker image rm `docker image ls -q` || true 
	docker system prune -f || true
clean : dockerclean
re : prune
	docker compose up 
prune : clean
	rm -rf db || true
	#rm -rf .venv || true
.PHONY : prod up down back devup devdown clean dockerclean prune
