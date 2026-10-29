let input=document.getElementById("input");
let addbtn=document.getElementById("addbtn");
let Tasklist=document.getElementById("Task-list");

let taskarr=[];

function creatTask(task,index){
    if(task.text===""){
        return;
    }else{
        let tasktext=document.createElement("span");
        tasktext.textContent=task.text;
        let li=document.createElement("li");
        li.style.listStyleType="none";
        li.append(tasktext);
        Tasklist.append(li);
    }
}
