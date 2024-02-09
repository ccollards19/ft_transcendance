prod : 
	docker compose up 
down : 
	docker compose down
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
