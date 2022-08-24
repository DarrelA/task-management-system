```sh
# Info
docker container ls -a
docker images
docker volume ls
docker network ls

# Rebuild if required
docker-compose up -d --build server
docker-compose down -v

# mysql
mysql -h localhost -P 3306 --protocol=tcp

# Cleanup
docker system prune -a
docker volume prune

# Debug
docker-compose config
docker logs tms-server
docker run -it tms-server sh
```
