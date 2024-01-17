// Выбор элементов DOM
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('.tasks-list');
const emptyList = document.querySelector('.emptyList');

// Добавление слушателей событий для формы и списка задач
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Инициализация массива задач
let tasks = [];

// Проверка наличия задач в localStorage, если есть - загрузка
if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

// Проверка и обновление сообщения о пустом списке
checkEmptyList();

// Функция для добавления новой задачи
function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;
    if(taskText === '') return;

    // Создание нового объекта задачи
    let newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавление новой задачи в массив, сохранение в localStorage и отрисовка задачи
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTask(newTask);
    
    // Очистка ввода и фокусировка на поле ввода
    taskInput.value = '';
    taskInput.focus();

    // Проверка и обновление сообщения о пустом списке
    checkEmptyList();
}

// Функция для удаления задачи
function deleteTask(e){
    if (e.target.dataset.action !== 'delete') return;
    const parentNode = e.target.closest('li');

    // Удаление задачи из массива, сохранение в localStorage
    tasks = tasks.filter(task => task.id !== Number(parentNode.id));
    saveTasksToLocalStorage();

    // Удаление задачи из DOM
    parentNode.remove();

    // Проверка и обновление сообщения о пустом списке
    checkEmptyList();
}

// Функция для отметки задачи как выполненной
function doneTask(e){
    if (e.target.dataset.action !== 'done') return;
    const parentNode = e.target.closest('li');

    // Получение ID задачи и изменение ее статуса выполненной/невыполненной
    const id = Number(parentNode.id);
    const task = tasks.find(task => task.id === id);
    task.done = !task.done;
    saveTasksToLocalStorage();

    // Изменение стиля текста задачи в DOM
    const taskTitle = parentNode.querySelector('.tasks-list__title-task');
    taskTitle.classList.toggle('tasks-list__title-task_done');
}

// Проверка и обновление сообщения о пустом списке
function checkEmptyList() { 
    if (tasks.length === 0) {
        // Вставка сообщения о пустом списке в DOM
        const emptyListHTML = `<li id="emptyList" class="tasks-list__task emptyList">
                                    <span class="tasks-list__title-task">Список пуст</span>
                                </li>`;
    
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        // Удаление сообщения о пустом списке из DOM
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

// Сохранение задач в localStorage
function saveTasksToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Отрисовка задачи в DOM
function renderTask(task) {
    // Определение CSS-класса в зависимости от статуса выполнения задачи
    const cssClass = task.done ? 'tasks-list__title-task tasks-list__title-task_done' : 'tasks-list__title-task';

    // Генерация HTML-разметки задачи и вставка в DOM
    const taskHTML = `<li id="${task.id}" class="tasks-list__task">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="tasks-list__btns">
                        <button class="tasks-list__btn" data-action="done">Выполнено</button>
                        <button class="tasks-list__btn tasks-list__btn_red" data-action="delete">Удалить</button>
                    </div>
                </li>`
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}