Executing:
1. copy the git repo, and use "npm i" to install all dependencies.
2. create a database in PostgreSQL.
3. create a .env file and add all the listed things from the .env.example, use the created database as the database name and the server password in the password.
4. use "npm run migrate" to create all the tables in the database.
5. use "npm run seed:run" to add all the seeding data to the databases.
6. Database connection has been made, thus all functions now work as before but in the database.
7. Pagination has been added for all get routes. (get users, get tasks, get usertasks)
