```sh
# Info
docker container ls -a
docker images
docker volume ls
docker network ls

# Rebuild if required
docker-compose up -d --build server

# Cleanup
docker system prune -a
docker volume prune

# Debug
docker logs tms-server
docker run -it tms-server sh
```
