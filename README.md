# Task Manager Project

Save Your Notes

## Usage Instructions
- Admin User credentials: admin:admin
- Access Django Admin DB Management at http://localhost:8000/admin.
- The application features complex validators in Register, Login routes, and when creating or updating tasks.
- Create tasks using the Create button.
- Double-click on a task to view more details and options such as Delete and Update.
- Tasks table headers are sortable by clicking on specific headers.
- Utilize the search bar to search for tasks by all fields, searching full names only (e.g., "High Priority").
- You can select multiple tasks to delete from the tasks table.
- Task category input includes previously used categories, or you can enter a new one.

## API Testing
- Test Start by creating a task, updating it, reading its details, and then deleting it.
- Run `pytest test_api` once to execute API tests. Note that the next task_id will be 2 (configurable in test_api.py).
- After each task creation, the task_id in the Django database increments by 1.
- Visit "http://localhost:7000/docs" for more information regarding the Task API within this project.

## How To Setup 
Docker-compose:
```
git clone https://github.com/SunLaria/Task-Manager-App.git
cd Task-Manager-App
docker-compose up -d # start
docker-compose down # stop
```

Docker-compose.yml Preview:
```
version: '4'
volumes:
  shared-app:
services:
  django:
    image: docker.io/randomg1/task-manager-app:1
    ports:
      - "8000:8000"
    volumes:
      - shared-app:/app

  fastapi:
    image: docker.io/randomg1/task-manager-app-api:1
    ports:
      - "7000:7000"
    volumes:
      - shared-app:/app
    
```

localy:
```
git clone https://github.com/SunLaria/Task-Manager-App.git
cd Task-Manager-App
python -m pip install -r requirements.txt
```
- Run both FastAPI and Django debug servers using the pre-built configurations provided for VSCode.

## How To Run:
Navigate to http://localhost:8000/ or http://127.0.0.1:8000/


## Technology Stack
- This project is built using Django and FastAPI frameworks.
- Django Framework for server-side logic.
- FastAPI for API CRUD operations, leveraging Django ORM database functions.
- Django Password Validators are disabled for production use.
- The frontend is a Single Page Application (SPA) mainly written in JavaScript.