// script.js

// Seleciona os elementos do DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let isEditing = false;
let currentTask = null;

// Função para carregar tarefas do localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    addTaskToDOM(task);
  });
}

// Função para salvar tarefa no localStorage
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para adicionar tarefa ao DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'border', 'rounded', 'mb-2', 'bg-gray-100');
  li.innerHTML = `
    <span>${task.text}</span>
    <div>
      <button class="edit-task p-1 bg-yellow-500 text-white rounded mr-1">Editar</button>
      <button class="delete-task p-1 bg-red-500 text-white rounded">Excluir</button>
    </div>
  `;
  taskList.appendChild(li);

  // Evento para editar tarefa
  li.querySelector('.edit-task').addEventListener('click', () => {
    isEditing = true;
    currentTask = task;
    taskInput.value = task.text;
    taskForm.querySelector('button').textContent = 'Atualizar';
  });

  // Evento para excluir tarefa
  li.querySelector('.delete-task').addEventListener('click', () => {
    taskList.removeChild(li);
    deleteTaskFromStorage(task.text);
  });
}

// Função para deletar tarefa do localStorage
function deleteTaskFromStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para atualizar tarefa no localStorage
function updateTaskInStorage(oldText, newText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.text === oldText);
  if (taskIndex !== -1) {
    tasks[taskIndex].text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Evento para adicionar ou atualizar tarefa
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  if (isEditing) {
    updateTaskInStorage(currentTask.text, taskText);
    loadTasksAgain();
    isEditing = false;
    currentTask = null;
    taskForm.querySelector('button').textContent = 'Adicionar';
  } else {
    const newTask = { text: taskText };
    saveTask(newTask);
    addTaskToDOM(newTask);
  }

  taskInput.value = '';
});

// Função para recarregar as tarefas novamente
function loadTasksAgain() {
  taskList.innerHTML = '';
  loadTasks();
}

// Carrega tarefas ao iniciar
document.addEventListener('DOMContentLoaded', loadTasks);
