const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('.tasks-list');
const emptyList = document.querySelector('.emptyList');

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;
    if(taskText === '') return;

    let newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTask(newTask);
    
    // Состояние после ввода задачи
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(e){
    if (e.target.dataset.action !== 'delete') return;
    const parentNode = e.target.closest('li');

    let id = Number(parentNode.id);
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToLocalStorage();

    parentNode.remove();
    checkEmptyList();
}

function doneTask(e){
    if (e.target.dataset.action !== 'done') return;
    const parentNode = e.target.closest('li');

    let id = Number(parentNode.id);
    let task = tasks.find(task => task.id === id);
    task.done = !task.done;
    saveTasksToLocalStorage();

    const taskTitle = parentNode.querySelector('.tasks-list__title-task');
    taskTitle.classList.toggle('tasks-list__title-task_done');

}

function checkEmptyList() { 
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="tasks-list__task emptyList">
                                    <span class="tasks-list__title-task">Список пуст</span>
                                </li>`;
    
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveTasksToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'tasks-list__title-task tasks-list__title-task_done' : 'tasks-list__title-task';
    const taskHTML = `<li id="${task.id}" class="tasks-list__task">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="tasks-list__btns">
                        <button class="tasks-list__btn" data-action="done">Выполнено</button>
                        <button class="tasks-list__btn tasks-list__btn_red" data-action="delete">Удалить</button>
                    </div>
                </li>`
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}