API_URL = "http://127.0.0.1:7000" 
const user_id = JSON.parse(document.getElementById('user_id').textContent);
function readTasksDB(user_id,task_id,tag){
    const params = {}
    if (this.user_id) { params.user_id = this.user_id }
    if (this.task_id) { params.task_id = this.task_id }
    if (this.tag) { params.tag = this.tag }

    axios.get(API_URL+"/read-task",{params: params , headers: {'Content-Type': 'application/json'}})
    .then((response) => {
        const Table = document.getElementById("Task-Table")
        const Tasks = Array.from(response.data.result)
        const fields = ["Name","Date","Category","Tag"]
        Tasks.map(function(e){
            let table_row = document.createElement("tr");
            fields.map((d)=>{
                let td = document.createElement("td")
                td.innerHTML=e[d]
                table_row.appendChild(td)
            })
            Table.appendChild(table_row)
        })
    })
}

readTasksDB(user_id)