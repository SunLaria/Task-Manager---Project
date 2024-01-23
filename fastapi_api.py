import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'Taskmanager.settings')
django.setup()


from fastapi import FastAPI,HTTPException, Request,Body, Query
from starlette import status
from pydantic import BaseModel, Field
from typing import Annotated
from datetime import date
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse 
from django import db
from django.http import JsonResponse as DjangoJsonResponse
from Task_Manager_app.models import Task, Category
from django.contrib.auth.models import User
from starlette.middleware.cors import CORSMiddleware



#   "id": 17,
#       "Name": "Clean bad",
#       "Date": "2024-01-28",
#       "Category": "home",
#       "Tag": "high-priority",
#       "Description": "Asap",
#       "Created_at": "2024-01-22",
#       "Updated_at": "2024-01-22",
#       "User": 1
#     }
#   ]


class Task_Schema(BaseModel):
    id : int | None = Field(default=None, ge=0)
    Name: str | None = Field(default=None,max_length=100)
    Date: date | None = Field(default=None)
    Category : str |None = Field(default=None,max_length=100)
    Tag: str |None = Field(default=None,max_length=16, examples=["high-priority","medium-priority","low-priority","no-priority"])
    Description : str | None = Field(default=None)
    Created_at : date | None = Field(default=None)
    Updated_at : date | None = Field(default=None)
    User : int | None = Field(default=None)
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                "Name": "Clean bad",
                "Date": "2024-01-28",
                "Category": "home",
                "Tag": "high-priority",
                "Description": "Asap"
                }
            ]
        }
    }

app = FastAPI(title="Task Api",description="The API I Made For Task Manager")

origins = [
    "http://localhost:*",
    "http://localhost:8000",
    "http://localhost:7000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}))


@app.post("/create-task", status_code = status.HTTP_201_CREATED, tags=["Task"])
def create_task(user_id:Annotated[int,Body(ge=1,example=1)] ,task:Task_Schema):
    try:
        data=jsonable_encoder(task.model_dump(exclude_unset=True))     
        new_task = Task(Name=data["Name"],Date=data["Date"],Category=User.objects.get(id=user_id).category_set.get_or_create(Name=data["Category"])[0],Tag=data["Tag"],Description=data["Description"],User=User.objects.get(id=user_id))
        new_task.clean_fields()
        new_task.save()
        return JSONResponse(content={"detail":"Task Creation Succesfull"},status_code=status.HTTP_201_CREATED)
    except:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Task Creation Failed")
    
@app.patch("/update-task", status_code = status.HTTP_202_ACCEPTED, tags=["Task"])
def update_task(user_id:Annotated[int,Body(ge=1,example=1)], task_id:Annotated[int,Body(ge=1,example=1)] ,task:Task_Schema):
    try:
        update_data=jsonable_encoder(task.model_dump(exclude_unset=True)) 
        task_db=Task.objects.get(id=task_id)
        [setattr(task_db, x, y) if x!="Category" else setattr(task_db, x, User.objects.get(id=user_id).category_set.get_or_create(Name=y)[0]) for x,y in update_data.items()]
        task_db.save()
        return JSONResponse(content={"detail":"Task Update Succesfull"},status_code=status.HTTP_202_ACCEPTED)
    except:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Task Update Failed")
    
@app.delete("/delete-task",status_code = status.HTTP_200_OK, tags=["Task"])
def delete_task(tasks_id:Annotated[list[int],Body()]):
    try:
        [Task.objects.get(id=tasks_id[i]).delete() for i in range(len(tasks_id))]
        return JSONResponse(content={"detail":"Task Delete Succesfull"},status_code=status.HTTP_200_OK)
    except:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Task Delete Failed")

@app.get("/read-task",status_code=status.HTTP_202_ACCEPTED,tags=["Task"])
def get_tasks(user_id:Annotated[int | None, Query(ge=1,example=1)] = None, task_id:Annotated[int | None,Query(ge=1,example=1)] = None, tag: Annotated[str | None,Query(pattern='(high-priority|medium-priority|low-priority|no-priority)')] = None):
    if task_id:
        try:
            result = {"result":[i.to_dict() for i in Task.objects.filter(id=task_id)]}
            if len(result["result"]) > 0:
                return result
            else:
                return {"result":"No Data Found"}
        except:
            raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Failed To Retrive Data From DB")
    elif user_id and tag:
        try:
            result = {"result":[i.to_dict() for i in Task.objects.filter(User=user_id,Tag=tag)]}
            if len(result["result"]) > 0:
                return result
            else:
                return {"result":"No Data Found"}
        except:
            raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Failed To Retrive Data From DB")
   
    elif user_id:
        try:
            result = {"result":[i.to_dict() for i in Task.objects.filter(User=user_id)]}
            if len(result["result"]) > 0:
                return result
            else:
                return {"result":"No Data Found"}
        except:
            raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Failed To Retrive Data From DB")
    else:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Failed To Retrive Data From DB")