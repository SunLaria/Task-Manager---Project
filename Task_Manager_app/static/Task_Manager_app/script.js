API_URL = "http://127.0.0.1:7000";

// user_id from django render
const user_id = JSON.parse(document.getElementById('user_id').textContent);


// copy img functions, return element
function copyImg(id,bool){
    if (bool) {
        let img = document.getElementById('img-tick').cloneNode(true);
        img.id = id;
        img.hidden=false;
        return img;
    } else {
        let img = document.getElementById('img-x').cloneNode(true);
        img.id = id;
        img.hidden=false;
        return img;
    }
}

// register password validations
function passwordValidation(field){
    if (field == 'id_password1' || "id_password2"){
        if (document.getElementById("id_password1").value == document.getElementById("id_password2")) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}


// check register form inputs
let formStatus=false;
function checkRegisterInputs(){
    const register_inputs = Array.from(document.getElementById("register-form")).slice(1,5);
    for (let i = 0; i < register_inputs.length; i++) {
        if (register_inputs[i].checkValidity()) {
            formStatus=true;
            if (register_inputs[i].id == "id_password2") {
                if (document.getElementById("id_password2").value != document.getElementById("id_password1").value) {
                    formStatus=false;
                    break;
                }
            }
        } else {
            formStatus=false;
            break;
        }
    }
    if (formStatus) {
        document.getElementById("register-button").disabled=false;
    } else {
        document.getElementById("register-button").disabled=true;
    }
}


// register form input validations
let passMatch;
let notEmpty;
function registerInputValidation(){
    const register_inputs = Array.from(document.getElementById("register-form")).slice(1,5);
    register_inputs.map((input)=>{
        input.addEventListener('input',()=>{
            passMatch=true;
            if (input.id == "id_password2") {
                if (document.getElementById("id_password2").value == document.getElementById("id_password1").value) {
                     passMatch = true;
                 } else{
                     passMatch = false;
                 }
            }
            if(input.value==""){
                notEmpty=false;
            }else{
                notEmpty=true;
            }
            if (input.checkValidity() && passMatch && notEmpty){
                    if (document.getElementById(`img-${input.id}`)){
                        document.getElementById(`img-${input.id}`).remove();
                    }
                    let img = copyImg(`img-${input.id}`,true)
                    input.parentElement.appendChild(img);
            } else {
                if (document.getElementById(`img-${input.id}`)){
                    document.getElementById(`img-${input.id}`).remove();
                }
                let img = copyImg(`img-${input.id}`,false);
                input.parentElement.appendChild(img);
            }
            if (input.id == "id_password1") {
                if (document.getElementById("img-id_password2")){
                    if (input.getAttribute('src')!="/Task_Manager_app/static/Task_Manager_app/icons8-tick-48.png"){
                        if (document.getElementById("img-id_password2")){
                            let imgParent = document.getElementById("img-id_password2").parentElement;
                            document.getElementById("img-id_password2").remove();
                            let img = copyImg("img-id_password2",false);
                            imgParent.appendChild(img);
                        }   
                    }
                }
            }
            checkRegisterInputs();
        })
    })
}

// create register form clear button 
function registerClearButton(){
    let clearButton = document.createElement('button');
    clearButton.id="register-clear-button";
    clearButton.innerHTML="Clear";
    clearButton.addEventListener('click',()=>{
        const register_inputs = Array.from(document.getElementById("register-form")).slice(1,5);
        register_inputs.map((input)=>{
            input.value="";
            if (document.getElementById(`img-${input.id}`)) {
                document.getElementById(`img-${input.id}`).remove();
            }
        })
    })
    document.getElementById("register-form").appendChild(clearButton);
}


// taskForm saver from django render
let taskFormElement;
if (document.getElementById("tab")){
   taskFormElement = document.getElementById("tab").cloneNode(true);
    document.getElementById("tab").remove();
}



// get tasks function
function getTasksDB(requestParmaters){
    return axios.get(API_URL+"/read-task",{ params: requestParmaters , headers: {'Content-Type': 'application/json'}});
}


// update table from DB
function updateTableDB(requestParmaters){
    request = getTasksDB(requestParmaters);
    request.then((response) => {
        if (response.data.result!="No Data Found"){
            if(document.getElementById("no-tasks-message")){
                document.getElementById("no-tasks-message").remove();
            }
            buildTable(response.data.result);
        } else {
            createEmptyMessage();
        }
    })
}


function createEmptyMessage() {
    let message = document.createElement("td");
    message.id="no-tasks-message";
    message.innerHTML="No Tasks";
    message.colSpan=4;
    document.getElementById("Task-Table").appendChild(message);
}



// build the table from tasks list parameter
function buildTable(tasks){
    let rows = Array.from(document.getElementsByTagName("tr"));
    for (let i = 1; i < rows.length; i++) {
        rows[i].remove();
    }
    const Table = document.querySelector("tbody");
    const Tasks = Array.from(tasks);
    const fields = ["Name","Date","Category","Tag"];
    Tasks.map(function(e){
        let table_row = document.createElement("tr");
        fields.map((d)=>{
            let td = document.createElement("td");
            td.innerHTML=e[d];
            table_row.appendChild(td);
        })
        table_row.id=e['id'];
        table_row.addEventListener('click',()=>{
            if(chosenTasks){
                if (table_row.style.backgroundColor) {
                    chosenTasks.delete(Number(table_row.id));
                    table_row.style.backgroundColor="";
                } else {
                    chosenTasks.add(Number(table_row.id));
                    table_row.style.backgroundColor="rgb(211, 211, 211)";
                }
            }
        })
        table_row.addEventListener('dblclick',()=>{
            taskInfoTab(Number(table_row.id));
        })
        Table.appendChild(table_row);
    })
}


// table header sorter
function tableHeaderSort(field,bool){
    let requestData={user_id:user_id};
    getTasksDB(requestData)
    .then((response)=>{
        if (response.data.result!="No Data Found"){
            let tasks=Array.from(response.data.result);
            if (field == 'Date') {
                tasks.sort(function(a,b){
                    a = a["Date"].split("-").join("");
                    b = b["Date"].split("-").join("");
                    return a > b ? 1 : a < b ? -1 : 0;
                })
                
            } else {
                tasks.sort((i,j)=>(i[field].localeCompare(j[field])));
            }
            if (bool) {
                buildTable(tasks);
            } else {
                buildTable(tasks.reverse());
            }
        }
    })
}


// assign tableHeaderSort function into th elements in table
function tableHeaderSortAsign() {
    const tableHeaders = document.getElementsByTagName('th');
    Array.from(tableHeaders).map(th=>{
        let ascend = true;
        th.addEventListener('click',()=>{
            if (document.getElementById("tab")) {
                document.getElementById("tab").remove();
            }
            if (ascend){
                tableHeaderSort(th.innerText, true);
                ascend = false;
            } else {
                tableHeaderSort(th.innerText, false);
                ascend = true;
            }
        })
    })
}


// delete task function
function DeleteTask(list){
    let taskIDList = Array.from(list);
    axios.delete(API_URL+"/delete-task", { data: taskIDList })
    .then((response) =>{
        console.log(response.data);
    })
}


// delete button task-table
function DeleteButton(){
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML="Delete";
    deleteButton.id="table-delete-button";
    deleteButton.addEventListener('click',()=>{
        if (chosenTasks.size > 0){
            if (confirm("Are You Sure?")){
                DeleteTask(chosenTasks);
                Array.from(chosenTasks).map((id)=>{
                    document.getElementById(id).remove();
                })
                document.getElementById("table-delete-button").remove();
                document.getElementById('select-button').innerHTML="Select";
                selectMode = false;
                chosenTasks = undefined;
                let rows = Array.from(document.getElementsByTagName("tr"));
                if (rows.length == 1) {
                    createEmptyMessage();
                }
            }
        }
    })
    document.getElementById("buttons").append(deleteButton);
}


// select button creation
let chosenTasks;
let selectMode;
function selectButton(){
    let selectButton = document.createElement("button");
    selectButton.innerHTML="Select";
    selectButton.id="select-button";
    selectMode=false;
    selectButton.addEventListener('click',()=>{
        if (document.getElementById("tab")) {
            document.getElementById("tab").remove();
        }
        if(selectMode){
            Array.from(chosenTasks).map(row_id=>{
                document.getElementById(row_id).style.backgroundColor="";
            })
            document.getElementById("table-delete-button").remove();
            selectButton.innerHTML="Select";
            selectMode = false;
            chosenTasks = undefined;
        } else {
            DeleteButton();
            selectButton.innerHTML="Unselect";
            chosenTasks = new Set();
            selectMode = true;
        }
    })
    document.getElementById("buttons").append(selectButton);
}


// create task function to db api
function createTaskDB(){
    let Task_Data = {
        Name : document.getElementById("id_Name").value,
        Date : document.getElementById("id_Date").value,
        Category : document.getElementById("id_Category").value,
        Tag : document.getElementById("id_Tag").value,
        Description : document.getElementById("id_Description").value
    }
    let dataCheck = Object.values(Task_Data).slice(0,4);
    for (let i = 0; i < dataCheck.length; i++) {
        if (dataCheck[i].length == 0) {
            if(document.getElementById("task-message")){
                document.getElementById("task-message").remove();
            }
            message = document.createElement("div");
            message.id = "task-message";
            message.innerHTML="Fill All Fields";
            document.getElementById('tab').appendChild(message);
            console.log("Form Not Valid");
            return false;
        }
    }
    axios.post(API_URL+"/create-task",{user_id:user_id,task:Task_Data, headers: {'Content-Type': 'application/json'}})
    .then((response) => {
        console.log(response.data);
        if(document.getElementById("task-message")){
            document.getElementById("task-message").remove();
        }
        location.reload();
    })
    
}


// create button in task-tab
function createTaskButton(){
    let createButton = document.createElement('button');
    createButton.id="create-task-button";
    createButton.innerHTML="Create";
    createButton.addEventListener('click',()=>{
        createTaskDB();
    })
    document.getElementById("tab").appendChild(createButton);
}


// clear button in task-tab
function clearTaskForm(){
    let clearButton = document.createElement('button');
    clearButton.id="create-clear-button";
    clearButton.innerHTML="Clear";
    clearButton.addEventListener('click',()=>{
        let taskFormInputs = Array.from(document.getElementById("tab").getElementsByTagName('input'));
        taskFormInputs.push(document.getElementById("id_Description"));
        taskFormInputs.push(document.getElementById("id_Tag"));
        taskFormInputs.map((input)=>{
            input.value="";
            if (document.getElementById(`img-${input.id}`)) {
                document.getElementById(`img-${input.id}`).remove();
            }
        })
    })
    document.getElementById("tab").appendChild(clearButton);
}


// cancel button in task-tab
function cancelTaskForm(){
    let cancelButton = document.createElement('button');
    cancelButton.id="create-cancel-button";
    cancelButton.innerHTML="Cancel";
    cancelButton.addEventListener('click',()=>{
        if(document.getElementById("tab")){
            document.getElementById("tab").remove();
        }
    })
    document.getElementById("tab").appendChild(cancelButton);
}


// check task input validation
function inputValidatorsForm(){
    let taskFormInputs = Array.from(document.getElementById("tab").getElementsByTagName('input')).slice(0,3);
    taskFormInputs.push(document.getElementById("id_Tag"));
    taskFormInputs.map((input)=>{
        input.addEventListener('change',()=>{
            if (input.value!="") {
                if (document.getElementById(`img-${input.id}`)) {
                    document.getElementById(`img-${input.id}`).remove();
                }
                let parent = input.parentElement;
                let img = copyImg(`img-${input.id}`,true);
                parent.appendChild(img);
            }else{
                if (document.getElementById(`img-${input.id}`)) {
                    document.getElementById(`img-${input.id}`).remove();
                }
                let parent = input.parentElement;
                let img = copyImg(`img-${input.id}`,false);
                parent.appendChild(img);
            }
        })
    })
}


function createTabDivForm() {
    let copy = taskFormElement.cloneNode(true);
    copy.getElementsByTagName("p")[5].remove();
    document.getElementById("content").appendChild(copy);
}


// create task button on tasks-table
function homeCreateButton(){
    let createButton = document.createElement("button");
    createButton.innerHTML="Create";
    createButton.id="home-create-button";
    createButton.addEventListener('click',()=>{
        if (document.getElementById("tab")) {
            document.getElementById("tab").remove();
        }
        createTabDivForm();
        createTaskButton();
        clearTaskForm();
        cancelTaskForm();
        inputValidatorsForm();    
    })
    document.getElementById("buttons").append(createButton);
}


// task-info tab delete button
function taskInfoDeleteButton(task_id){
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML="Delete";
    deleteButton.id="tab-delete-button";
    deleteButton.addEventListener('click',()=>{
        if (confirm("Are You Sure?")){
            DeleteTask([task_id]);
            document.getElementById('tab').remove();
            document.getElementById(task_id).remove();
        }
        let rows = Array.from(document.getElementsByTagName("tr"));
                if (rows.length == 1) {
                    createEmptyMessage();
                }
    })
    document.getElementById("tab").appendChild(deleteButton);
}


// task-info tab cancel button
function taskInfoCancelButton(){
    let cancelButton = document.createElement("button");
    cancelButton.innerHTML="Cancel";
    cancelButton.id="cancel-button";
    cancelButton.addEventListener('click',()=>{
        document.getElementById('tab').remove();
    })
    document.getElementById("tab").appendChild(cancelButton);
}


// task-info tab creation:
function taskInfoTab(task_id){
    if (document.getElementById("tab")) {
        document.getElementById("tab").remove();
    }
    let taskInfoTab = document.createElement("div");
    taskInfoTab.id="tab";
    let taskInfoTable = document.createElement("table");
    taskInfoTable.id='task-tab-table';
    let taskInfotbody = document.createElement("tbody");
    taskInfotbody.id = "task-tab-tbody";
    let taskID = document.createElement("input");
    taskID.id="task-id";
    taskID.hidden="true";
    let fields = ['Name','Date','Category','Tag','Description','Created_at','Updated_at'];
    let requestData={task_id:Number(task_id)};
    getTasksDB(requestData).then((response)=>{
        taskID.value=response.data.result[0]["id"];
        taskInfotbody.appendChild(taskID);
        for (let i = 0; i < fields.length; i++) {
            let tableRow = document.createElement("tr");
            let collumnName = document.createElement("td");
            if (fields[i] == 'Created_at'){
                collumnName.innerHTML='Created at:';
            } else if (fields[i] == 'Updated_at') {
                collumnName.innerHTML='Updated at:';
            } else {
                collumnName.innerHTML=`${fields[i]}:`;
            }
            tableRow.appendChild(collumnName);
            let task_data = document.createElement("td");
            task_data.id=`task-tab-${fields[i]}`;
            task_data.innerHTML=response.data.result[0][fields[i]];
            tableRow.appendChild(task_data);
            taskInfotbody.appendChild(tableRow);
        }
    })
    taskInfoTable.appendChild(taskInfotbody);
    taskInfoTab.appendChild(taskInfoTable);
    document.getElementById("content").appendChild(taskInfoTab);
    taskInfoUpdateButton();
    // taskInfoShareButton()
    taskInfoDeleteButton(task_id);
    taskInfoCancelButton();
}

// add user_id to form - hidden input
function addUserIdForm(task_id){
    let taskID = document.createElement("input");
    taskID.id="id_id";
    taskID.hidden="true";
    taskID.value=task_id;
    document.getElementById("tab").appendChild(taskID);
}


// save button in update-task-tab
function saveTaskButton(){
    let saveButton = document.createElement('button');
    saveButton.id="save-task-button";
    saveButton.innerHTML="Save";
    saveButton.addEventListener('click',()=>{
        updateTaskDB();
    })
    document.getElementById("tab").appendChild(saveButton);
}


// task-info tab update setup
function createUpdateTab(){
    let requestData={task_id:Number(document.getElementById("task-id").value)};
    if (document.getElementById("tab")) {
        document.getElementById("tab").remove();
    }
    createTabDivForm();
    addUserIdForm();
    saveTaskButton();
    clearTaskForm();
    cancelTaskForm();
    inputValidatorsForm();
    getTasksDB(requestData)
    .then(response=>{
        let fields = ['id','Name','Date','Category','Tag','Description'];
        fields.map(field=>{
            document.getElementById(`id_${field}`).value=response.data.result[0][field];
        })
    })
}


// string to title case
function titleCase(str) {
    return str.toLowerCase().split(' ').map((word)=> {
      return (word[0].toUpperCase() + word.slice(1));
    }).join(' ');
  }


// update task function to db api
let updateFormStatus
function updateTaskDB(){
    let task_id = document.getElementById("id_id").value;
    let Task_Data = {
        Name : document.getElementById("id_Name").value,
        Date : document.getElementById("id_Date").value,
        Category : document.getElementById("id_Category").value,
        Tag : document.getElementById("id_Tag").value,
        Description : document.getElementById("id_Description").value
    }
    let dataCheck = Object.values(Task_Data).slice(0,4);
    for (let i = 0; i < dataCheck.length; i++) {
        if (dataCheck[i].length == 0) {
            if(document.getElementById("task-message")){
                document.getElementById("task-message").remove();
            }
            message = document.createElement("div");
            message.id = "task-message";
            message.innerHTML="Fill All Fields";
            document.getElementById('tab').appendChild(message);
            console.log("Form Not Valid")
            return false;
        }
    }
    axios.patch(API_URL+"/update-task",{user_id:user_id,task_id:task_id,task:Task_Data, headers: {'Content-Type': 'application/json'}})
    .then((response) => {
        if(document.getElementById("task-message")){
            document.getElementById("task-message").remove();
        }
        message = document.createElement("div");
        message.id = "task-message";
        message.innerHTML=response.data.detail;
        document.getElementById('tab').appendChild(message);
        document.getElementById("tab").remove();
        let fields = ['Name','Date','Category','Tag'];
        let tableRow = Array.from(document.getElementById(task_id).getElementsByTagName("td"));
        for (let i = 0; i < fields.length; i++) {
            tableRow[i].innerHTML=titleCase(Task_Data[fields[i]]);
        }
    })
}



// task-info tab update button
function taskInfoUpdateButton(){
    let updateButton = document.createElement("button");
    updateButton.innerHTML="Update";
    updateButton.id="update-button";
    updateButton.addEventListener('click',()=>{
        createUpdateTab();
        
    })
    document.getElementById("tab").appendChild(updateButton);
}

// taskFormElement 
// task-info share function api
// function taskInfoShareDB(){
//     console.log("hello")
// }


// // task info tab share button -- not implanted
// function taskInfoShareButton(){
//     let shareButton = document.createElement("button");
//     shareButton.innerHTML="Share";
//     shareButton.id="Share-button";
//     shareButton.addEventListener('click',()=>{
//         let formCopy = taskFormElement.cloneNode(true)
//         console.log(Array.from(formCopy))
//         document.getElementById("tab").appendChild(userInput);
//         console.log("share")
//     })
//     document.getElementById("tab").appendChild(shareButton);
// }


// site logo - home click event
function siteNameHref(){
    document.getElementById("site-name").addEventListener('click',()=>{
        window.location.replace("/");
    })
}
siteNameHref();


// search-bar event
function searchEvent(){
    let searchBar = document.createElement("input");
    searchBar.id="task-search-bar";
    searchBar.placeholder="Search Something...";
    searchBar.addEventListener("input",()=>{
        let params = {user_id:user_id};
        getTasksDB(params)
        .then((response)=>{
            let tasksFromDB = response.data.result;
            if (tasksFromDB != 0) {
                let tasks = [];
                for (let i = 0; i < tasksFromDB.length; i++) {
                    if (Object.values(tasksFromDB[i]).includes(searchBar.value)) {
                        tasks.push(tasksFromDB[i]);
                    }
                }
                if (tasks.length > 0) {
                    buildTable(tasks);
                } 
                if (searchBar.value=="") {
                    let params = {user_id:user_id};
                    getTasksDB(params)
                    .then((response)=>{
                        let tasks = response.data.result;
                        buildTable(tasks);
                })
                }
            }
        })
    })
    document.body.appendChild(searchBar);
}


// home main function
function mainHome(){
    tableHeaderSortAsign();
    let requestData={user_id:user_id};
    updateTableDB(requestData);
    selectButton();
    homeCreateButton();
    searchEvent();
    
}


// register main function
function mainRegister(){
    registerInputValidation();
    registerClearButton();
}


// route main check
if (window.location.href.split("/")[3] == "") {
    mainHome();
} else if (window.location.href.split("/")[3] == "register") {
    mainRegister();
}