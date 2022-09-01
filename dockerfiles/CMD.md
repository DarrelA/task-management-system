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


#######################################################

# Build tms-server image
docker build -t tms-server -f dockerfiles/server.dockerfile .

# Save & load tar file
docker save -o tms-server.tar tms-server
docker load -i tms-server.tar

# MD5 checksum
# Powershell
(Get-FileHash tms-server.tar -Algorithm MD5).hash -eq (cat hash.txt)
# MacOS
# flag -q Quiet mode - only the checksum is printed out.
# man md5
md5 -q tms-server.tar
md5 -q tms-server.tar > hash.txt
# Check if identical hash
diff -s hash.txt secret.txt

# Connect with a different database connection
docker run --name tms-server --rm -dp 4000:4000 --env-file ./.env tms-server
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
