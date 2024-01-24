API_URL = "http://127.0.0.1:7000" ;
const user_id = JSON.parse(document.getElementById('user_id').textContent);



// get tasks function
function getTasksDB(requestParmaters){
    return axios.get(API_URL+"/read-task",{ params: requestParmaters , headers: {'Content-Type': 'application/json'}})
}


// create task function
function createTaskDB(){
    let Task_Data = {
        Name : document.getElementById("id_Name").value,
        Date : document.getElementById("id_Date").value,
        Category : document.getElementById("id_Category").value,
        Tag : document.getElementById("id_Tag").value,
        Description : document.getElementById("id_Description").value
    }
    let dataCheck = Object.values(Task_Data).slice(0,4)
    for (let i = 0; i < dataCheck.length; i++) {
        if (dataCheck[i]=="") {
            if(document.getElementById("Create-task-message")){
                document.getElementById("Create-task-message").remove();
            }
            message = document.createElement("div");
            message.id = "Create-task-message";
            message.innerHTML="Fill All Fields"
            document.getElementById('create-element').appendChild(message);
            return console.log("not valid");
        } 
    }
    console.log(Task_Data);
    axios.post(API_URL+"/create-task",{user_id:user_id,task:Task_Data, headers: {'Content-Type': 'application/json'}})
    .then((response) => {
        console.log(response.data);
        if(document.getElementById("Create-task-message")){
            document.getElementById("Create-task-message").remove();
        }
        message = document.createElement("div");
        message.id = "Create-task-message";
        message.innerHTML=response.data.detail;
        document.getElementById('create-element').appendChild(message);
        let taskFormInputs = Array.from(document.getElementById("create-element").getElementsByTagName('input'));
        taskFormInputs.map((input)=>{input.value=""});
        document.getElementById("id_Description").value="";
        document.getElementById("id_Tag").value="";
        requestData={user_id:user_id}
        UpdateTable(requestData);
    })
}



// delete task function
function DeleteTask(list){
    let taskIDList = Array.from(list)
    axios.delete(API_URL+"/delete-task", { data: taskIDList })
    .then((response) =>{
        console.log(response.data)
    })
}


// update table function
function UpdateTable(requestParmaters){
    request = getTasksDB(requestParmaters)
    request.then((response) => {
        const Table = document.querySelector("tbody")
        if (response.data.result!="No Data Found"){
            if(document.getElementById("no-tasks-message")){
            document.getElementById("no-tasks-message").remove();
            }
            let rows = Array.from(document.getElementsByTagName("tr"));
            for (let i = 1; i < rows.length; i++) {
                rows[i].remove();
            }
            const Tasks = Array.from(response.data.result)
            const fields = ["Name","Date","Category","Tag"]
            Tasks.map(function(e){
                let table_row = document.createElement("tr");
                fields.map((d)=>{
                    let td = document.createElement("td");
                    td.innerHTML=e[d];
                    table_row.appendChild(td);
                })
                table_row.id=e['id']
                table_row.addEventListener('click',()=>{
                    if(chosenTasks){
                        if (table_row.style.backgroundColor) {
                            chosenTasks.delete(Number(table_row.id))
                            table_row.style.backgroundColor=""
                         } else {
                            chosenTasks.add(Number(table_row.id));
                            table_row.style.backgroundColor="grey"
                        }
                    }
                })
                table_row.addEventListener('dblclick',()=>{
                    taskInfoTab(Number(table_row.id))
                })
                Table.appendChild(table_row);
            })
        } else {
            let message = document.createElement("p")
            message.id="no-tasks-message";
            message.innerHTML="No Tasks";
            Table.appendChild(message);
        }
    })
}


function tableHeaderSort(field){
    requestData={user_id:user_id}
    getTasksDB(requestData)
    .then((response)=>{
        if (field == 'Date') {
            
        }
    })

}


// // table table header sort -- StackOverFlow
// const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
// const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
//     v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
//     )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
// document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
//     const table = th.closest('table');
//     Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
//         .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
//         .forEach(tr => table.appendChild(tr) );
// })));


// delete button function creation
function DeleteButton(){
    let deleteButton = document.createElement("button")
    deleteButton.innerHTML="Delete"
    deleteButton.id="delete-button"
    deleteButton.addEventListener('click',()=>{
        if (chosenTasks.size > 0){
            if (confirm("Press a button!")){
                DeleteTask(chosenTasks);
                Array.from(chosenTasks).map((id)=>{
                    document.getElementById(id).remove()
                })
                document.getElementById("delete-button").remove()
                document.getElementById('select-button').innerHTML="Select"
                selectMode = false
                chosenTasks = undefined

            }
        }
    })
    document.getElementById("table-content").append(deleteButton)
}




// task-info tab creation:
function taskInfoTab(task_id){
    if (document.getElementById("task-info-tab")) {
        document.getElementById("task-info-tab").remove()
    }
    let taskInfoTab = document.createElement("div")
    taskInfoTab.id="task-info-tab"
    let taskInfoTable = document.createElement("table")
    taskInfoTable.id="task-tab-table"
    let fields = ['Name','Date','Category','Tag','Description','Created_at','Updated_at']
    requestData={task_id:Number(task_id)}
    getTasksDB(requestData).then((response)=>{
        for (let i = 0; i < fields.length; i++) {
            let tableRow = document.createElement("tr");
            let collumnName = document.createElement("td");
            if (fields[i] == 'Created_at'){
                collumnName.innerHTML='Created at:'
            } else if (fields[i] == 'Updated_at') {
                collumnName.innerHTML='Updated at:'
            } else {
                collumnName.innerHTML=`${fields[i]}:`;
            }
            tableRow.appendChild(collumnName);
            let task_data = document.createElement("td");
            task_data.id=`task-tab-${fields[i]}`
            task_data.innerHTML=response.data.result[0][fields[i]];
            tableRow.appendChild(task_data);
            taskInfoTable.appendChild(tableRow);
        }

    })
    taskInfoTab.appendChild(taskInfoTable);
    document.body.appendChild(taskInfoTab);
    taskInfoUpdateButton();
    taskInfoDeleteButton(task_id);
    taskInfoCancelButton();
}



// function clone create and put values inside



// task-info tab update button
let updateMode
function taskInfoUpdateButton(){
    let updateButton = document.createElement("button")
    updateButton.innerHTML="Update"
    updateButton.id="update-button"
    updateButton.addEventListener('click',()=>{
        console.log(updateButton)
        
    })
    document.getElementById("task-info-tab").appendChild(updateButton)
}


// task-info tab delete button
function taskInfoDeleteButton(task_id){
    let deleteButton = document.createElement("button")
    deleteButton.innerHTML="Delete"
    deleteButton.id="delete-button"
    deleteButton.addEventListener('click',()=>{
        console.log(deleteButton)
        if (confirm("Press a button!")){
            DeleteTask([task_id]);
        }
        document.getElementById('task-info-tab').remove()
        document.getElementById(task_id).remove()
    })
    document.getElementById("task-info-tab").appendChild(deleteButton)
}


// task-info tab cancel button
function taskInfoCancelButton(){
    let cancelButton = document.createElement("button")
    cancelButton.innerHTML="Cancel"
    cancelButton.id="cancel-button"
    cancelButton.addEventListener('click',()=>{
        console.log(cancelButton);
        document.getElementById('task-info-tab').remove();
    })
    document.getElementById("task-info-tab").appendChild(cancelButton)
}


// select button creation
let chosenTasks
let selectMode
function createSelectButton(){
    let selectButton = document.createElement("button")
    selectButton.innerHTML="Select"
    selectButton.id="select-button"
    selectMode=false
    selectButton.addEventListener('click',()=>{
        if(selectMode){
            Array.from(chosenTasks).map(row_id=>{
                document.getElementById(row_id).style.backgroundColor=""
            })
            document.getElementById("delete-button").remove()
            selectButton.innerHTML="Select"
            selectMode = false
            chosenTasks = undefined
        } else {
            DeleteButton()
            selectButton.innerHTML="Unselect"
            chosenTasks = new Set()
            selectMode = true
        }
    })
    document.getElementById("table-content").append(selectButton)
}


// main function
function Main(){
    // task rows choosen set - for multiple delete
    
    requestData={user_id:user_id}
    UpdateTable(requestData);
    createSelectButton()
    
    // create button - post to api todo: !!!!! create with dom -----!!!!!
    document.getElementById("Create_button").addEventListener("click",function(){
        createTaskDB();
    })
}

Main();