Running it on your own machine:

1. pull the docker image using: docker pull rashik977/todo:1.0
2. run the image using your own .env file (contents of the env are in .env.example), run command : docker run --env-file .env -p 3000:3000 rashik977/todo:1.0
3. use Postman(or your choice of HTTP client) to run CRUD on todo tasks.

Executing:
1. use GET '/' or '/tasks' to get all the tasks.
2. use GET '/tasks/:id' to get the task of that id.
3. use POST '/tasks' to create a task by parsing a JSON with the title and status of the task.
   note: status is an enum of "not started", "pending" and "done", anything else will result in an error in the API.
5. use PUT '/tasks/:id' to update that task.
6. use DELETE '/tasks/:id' to delete that task.
7. Porper error handling is impleted into the API.
