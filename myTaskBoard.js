const DOM = {
    textAreaRef: null,
    dateRef: null,
    timeRef: null,
    tasksAreaRef: null,
    formRef: null,
    addButtonRef: null,
}

const state = { MyTasks: [] };

function init() {
    DOM.textAreaRef = document.getElementById("textarea");
    DOM.dateRef = document.getElementById("date");
    DOM.timeRef = document.getElementById("time");
    DOM.tasksAreaRef = document.getElementById("tasksArea");
    DOM.formRef = document.getElementById("myForm");
    DOM.addButtonRef = document.getElementById("addTask")
    DOM.addButtonRef.addEventListener("click", createNote);
    try {
        const tasksString = localStorage.getItem("MyTasks");
        let tasks = JSON.parse(tasksString);
        if (!tasks) { return }
        state.MyTasks = tasks
    } catch { }
    draw(state.MyTasks)
    function clearButton() {
        const clearButton = document.getElementById("clearButton");
        clearButton.addEventListener("click", function () {
            document.getElementById("myForm").reset()
        })
    }
    clearButton()
}
function draw(tasks) {
    DOM.tasksAreaRef.innerHTML = "";
    for (let index = 0; index < tasks.length; index++) {
        const currentTask = tasks[index];
        const currentTaskNote = drawNote(currentTask)
        DOM.tasksAreaRef.append(currentTaskNote)
    }

}
function drawNote(task) {
    const outerDiv = document.createElement("div");
    const upperDiv = document.createElement("div")
    const paragraph = document.createElement("p");
    paragraph.classList.add("taskText", "float-start", "col-lg-10");
    paragraph.innerText = task.taskIntro;
    function createDeleteButton() {
        const deleteButton = document.createElement("button");
        const iconX = document.createElement("i");
        iconX.classList.add("bi", "bi-x-lg", "iconSize");
        deleteButton.classList.add("deleteButton", "float-end", "col-lg-2")
        deleteButton.append(iconX);


        deleteButton.addEventListener("click", function () {
            if (typeof task.taskId !== "string") { return }
            const id = task.taskId;
            for (let index = 0; index < state.MyTasks.length; index++) {
                const currentTask = state.MyTasks[index];
                if (currentTask.taskId === id) {
                    state.MyTasks.splice(index, 1)
                    console.log(`i found the movie`);
                    const tasksString = localStorage.getItem("MyTasks");
                    let tasks = JSON.parse(tasksString);
                    tasks = state.MyTasks;
                    localStorage.setItem("MyTasks", JSON.stringify(tasks));
                    draw(state.MyTasks)
                }

            }


        })
        return deleteButton
    }
    const deleteButton = createDeleteButton();

    upperDiv.append(paragraph, deleteButton);
    upperDiv.classList.add("noteUpperDiv")
    outerDiv.addEventListener("mouseenter", function () {
        deleteButton.style.visibility = "visible"
    });
    outerDiv.addEventListener("mouseleave", function () {
        deleteButton.style.visibility = "hidden";
    })
    if (task.taskIntro.length > 30) { upperDiv.classList.add("noteUpperDivScroll") }

    const lowerDiv = document.createElement("div");
    const dateSpan = document.createElement("span");
    const timeSpan = document.createElement("span");

    function changeDateDisplay() {
        const d = new Date(task.taskDate);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDay();
        const dateText = `${day}/${month}/${year}`

        return dateText

    }

    dateSpan.innerHTML = changeDateDisplay();
    timeSpan.innerHTML = task.taskTime;
    lowerDiv.append(dateSpan, timeSpan);
    lowerDiv.classList.add("noteLowerDiv")
    outerDiv.append(upperDiv, lowerDiv)
    outerDiv.classList.add("note", "col-lg-3", "fadein");
    return outerDiv;
}
function createNote() {
    const task = {
        taskIntro: DOM.textAreaRef.value,
        taskDate: DOM.dateRef.value,
        taskTime: DOM.timeRef.value,
        taskId: `${Math.ceil(Math.random() * 999)}`,
    }
    if (task.taskIntro.length <= 0) {
        return alert(`Insert Task Details`)
    }
    if (task.taskDate.length > 10) {
        return alert(`Insert Logical Date Please !`)
    }
    if (task.taskDate === "NaN/NaN/NaN") {
        return alert("Insert Task Deadline Date")
    }
    if (typeof task.taskTime !== "string") { return }
    state.MyTasks.push(task);
    localStorage.setItem("MyTasks", JSON.stringify(state.MyTasks));
    draw(state.MyTasks)
    document.getElementById("myForm").reset()
}
init()