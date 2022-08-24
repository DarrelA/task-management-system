```sh
# Info
docker container ls -a
docker images
docker volume ls
docker network ls

# Rebuild if required
docker-compose up -d --build server
# Shut down containers and delete volumes
docker-compose down -v

# mysql
mysql -h localhost -P 3306 --protocol=tcp -uroot -p

# Cleanup
docker system prune -a
docker volume prune

# Debug
docker-compose config
docker logs tms-server
docker logs tms-mysql
docker run -it tms-server sh
```
