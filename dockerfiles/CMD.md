```sh
# Info
docker container ls -a
docker images
docker volume ls
docker network ls

# Rebuild if required
docker-compose up -d --build server client
# Shut down containers and delete volumes
docker-compose down -v

# Cleanup
docker system prune -a
docker volume prune

# Debug
docker-compose config
docker logs tms-server
docker logs tms-mysql
docker run -it tms-server sh
```

```sql
use task_management_system;
DROP TABLE IF EXISTS usergroups, users, `groups`, applications, plans, tasks, notes CASCADE;

use mysql;
select host, user from mysql.user;
select host, user from mysql.user WHERE user = 'root';

DROP USER 'appuser'@'localhost';
flush privileges;

SHOW VARIABLES LIKE 'validate_password%';
```
