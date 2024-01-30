Task Manager Project.

Dango Framework.

FastAPI for api CRUD using djnago ORM database funtions.

No Django Password Validators, currently for production use.

SPA Site written mainly in JS.

How to build:
- pip install -r requirements.txt
- Run BOTH FastAPI and Django debug server, with the configurations provided.

How to test API:
- Djnago db task_id is ++1 after each task creation.
- Admin User = admin:admin
- You can test Create, Read, Update, Delete functions
- Test Creates Task, Update the Task, Read The Task, Then delete the task.
- You can run test_api using pytest once, beacuse the next task will be task_id=2 (it can be configured in test_api.py file). 


How to Use:
- Admin User = admin:admin
- Complex Validators in Register, login Routes And in Create, Update Task Tab.
- Create Task using Create Button
- Double click on task to see more details and options such ass: Delete, Update
- Task Table can be sorted while clicking specific headers.
- You can select multiple tasks to delete from the Tasks Table.
- User Past Categories are provided in category input you can choose or else you can create a new one.


WIP - Task Share option.
