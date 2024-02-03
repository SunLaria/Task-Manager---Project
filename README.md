Task Manager Project.

Dango Framework.

FastAPI For API CRUD Using Djnago ORM Database Funtions.

No Django Password Validators, Currently For Production Use.

SPA Site Written Mainly In JS.

How To Build:
- pip install -r requirements.txt
- Run BOTH FastAPI and Django debug server Using The Pre-built Configurations Provided for VSCode.

How to test API:
- Djnago DB task_id Is ++1 After Each Task Creation.
- Admin User = admin:admin
- You Can Test Create, Read, Update, Delete Functions
- Test Creates Task, Update The Task, Read The Task, Then Delete The Task.
- You Should Run test_api Using pytest Once, Beacuse The Next Task Will be task_id=2 (it can be configured in test_api.py file). 
- You Can Go Into "http://localhost:7000/docs" To See More Information Regarding Task API, Inside This Project.



How to Use:
- Admin User = admin:admin
- http://localhost:8000/admin For Django Admin DB Management.
- Complex Validators In Register, Login Routes And In Create, Update Task Tab.
- Create Task Using Create Button
- Double Click On Task To See More Details And Options Such As: Delete, Update
- Tasks Table Can Be Sorted While Clicking Specific Headers.
- Search Bar For All Fields, By Searching Full Names Only, Example - "High Priority"
- You Can Select Multiple Tasks To Delete From The Tasks Table.
- Task Category Input Include User Past Categories Or Else You Can Enter A New One.
