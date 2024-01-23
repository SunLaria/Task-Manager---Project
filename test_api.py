import requests
import pytest
url = "http://127.0.0.1:7000"

def test_create():
    data = {
  "user_id": 1,
  "task": {
    "Category": "home",
    "Date": "2024-01-28",
    "Description": "Asap",
    "Name": "Clean bad",
    "Tag": "high-priority"
  }}
    data_error={
  "user_id": 1,
  "task": {
    "Category": "home",
    "Date": "dasda",
    "Description": "Asap",
    "Name": "Clean bad",
    "Tag": "high"
  }}
    assert requests.post(url=url+"/create-task",json=data).json()["detail"]=="Task Creation Succesfull"

    false_request = requests.post(url=url+"/create-task",json=data_error)
    assert false_request.status_code == 422
        

def test_update():
    data = {
  "user_id": 1,
  "task_id": 17,
  "task": {
    "Category": "home",
    "Date": "2024-01-28",
    "Description": "Asap",
    "Name": "Clean bad",
    "Tag": "low-priority"
  }
}
    data_eror ={
  "user_id": 1,
  "task_id": 17,
  "task": {
    "Category": "home",
    "Date": "dasda",
    "Description": "Asap",
    "Name": "Clean bad",
    "Tag": "priority"
  }
}
    assert requests.patch(url=url+"/update-task",json=data).json()["detail"]=="Task Update Succesfull"

    false_request = requests.patch(url=url+"/update-task",json=data_eror)
    assert false_request.status_code == 422
        

# trouble testing multiple times as it deletes the task. the test is working.
def test_delete():
    data = [28]
    data_not_exist=[1]
    data_error=["ds"]
    # delete
    assert requests.delete(url=url+"/delete-task",json=data).json()["detail"]=="Task Delete Succesfull"
    # not exist
    false_request = requests.delete(url=url+"/delete-task",json=data_not_exist)
    assert false_request.json()["detail"] == "Task Delete Failed"   
    # validation error
    error_request = requests.patch(url=url+"/update-task",json=data_error)
    assert error_request.status_code == 422


def test_read():
    task_id=24
    user_id=1
    tag="high-priority"

    assert type(requests.get(url=url+f"/read-task?user_id={user_id}").json()["result"])==list
    assert type(requests.get(url=url+f"/read-task?task_id={task_id}").json()["result"])==list
    # validation error
    validation_error = requests.get(url=url+f"/read-task?user_id=0")
    assert validation_error.status_code == 422
    # no data according to input
    assert requests.get(url=url+f"/read-task?task_id=10000000").json()["result"]=="No Data Found"


