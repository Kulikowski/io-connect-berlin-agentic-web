/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  let todos = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'

  // --- DOM ELEMENTS ---
  const addTodoForm = document.getElementById('addTodoForm');
  const todoInput = document.getElementById('todoInput');
  const inputError = document.getElementById('inputError');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  // Stats elements
  const pendingCount = document.getElementById('pendingCount');
  const completedCount = document.getElementById('completedCount');
  const totalCount = document.getElementById('totalCount');

  // Edit Dialog elements
  const editDialog = document.getElementById('editDialog');
  const editTodoForm = document.getElementById('editTodoForm');
  const editTodoId = document.getElementById('editTodoId');
  const editTodoInput = document.getElementById('editTodoInput');
  const editInputError = document.getElementById('editInputError');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  // Delete Confirmation Dialog elements
  const deleteConfirmDialog = document.getElementById('deleteConfirmDialog');
  const deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  // --- STATE PERSISTENCE ---
  function loadTodos() {
    try {
      const stored = localStorage.getItem('tasksphere_todos');
      todos = stored ? JSON.parse(stored) : [
        { id: 'demo-1', text: 'Implement Imperative WebMCP', completed: false },
        { id: 'demo-2', text: 'Validate with DevTools (Imperative)', completed: false },
        { id: 'demo-3', text: 'Implement Declarative WebMCP', completed: false },
        { id: 'demo-4', text: 'Validate with DevTools (Declarative)', completed: false },
        { id: 'demo-5', text: 'Debug Imperative Tool', completed: false },
        { id: 'demo-6', text: 'Lighthouse Agentic Web Audit', completed: false }
      ];
    } catch (e) {
      console.error('Failed to load todos from localStorage', e);
      todos = [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem('tasksphere_todos', JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos to localStorage', e);
    }
  }

  // --- CORE ACTIONS / MUTATIONS ---

  /**
   * Retrieves the current list of todo items.
   * @returns {array} Array of todo items
   */
  function getTodos() {
    return todos;
  }

  /**
   * Adds a new task to the todo list.
   * @param {string} text - Task description
   * @returns {object} The newly created todo item
   */
  function addTodo(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return null;

    const newItem = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      text: trimmedText,
      completed: false
    };
    todos.unshift(newItem);
    saveTodos();
    render();
    return newItem;
  }

  /**
   * Removes a task from the list.
   * @param {string} id - The task identifier
   * @returns {boolean} True if removed, false otherwise
   */
  function removeTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return false;

    todos.splice(index, 1);
    saveTodos();
    render();
    return true;
  }

  /**
   * Toggles the completion state of a task.
   * @param {string} id - The task identifier
   * @returns {object|null} The updated todo item or null
   */
  function toggleTodo(id) {
    const item = todos.find(t => t.id === id);
    if (!item) return null;

    item.completed = !item.completed;
    saveTodos();
    render();
    return item;
  }

  /**
   * Modifies the description text of a task.
   * @param {string} id - The task identifier
   * @param {string} newText - The new text description
   * @returns {object|null} The updated todo item or null
   */
  function updateTodoText(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) return null;

    const item = todos.find(t => t.id === id);
    if (!item) return null;

    item.text = trimmed;
    saveTodos();
    render();
    return item;
  }

  // --- RENDERING / DOM UPDATES ---
  function render() {
    // 1. Calculate stats
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    // Update stats DOM with textContent
    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;

    // 2. Filter the list
    let filteredTodos = todos;
    if (currentFilter === 'active') {
      filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filteredTodos = todos.filter(t => t.completed);
    }

    // 3. Handle Empty States
    if (filteredTodos.length === 0) {
      emptyState.style.display = 'flex';
      todoList.style.display = 'none';
      todoList.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';
    todoList.style.display = 'flex';

    // 4. Generate and insert task item list
    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.setAttribute('data-id', todo.id);

      // Left Click Area (Checkbox + text)
      const leftArea = document.createElement('div');
      leftArea.className = 'todo-item-left';
      leftArea.addEventListener('click', () => toggleTodo(todo.id));

      const checkbox = document.createElement('div');
      checkbox.className = 'custom-checkbox';

      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = todo.text;

      leftArea.appendChild(checkbox);
      leftArea.appendChild(textSpan);
      li.appendChild(leftArea);

      // Right Action Buttons (Edit + Delete)
      const actionsArea = document.createElement('div');
      actionsArea.className = 'todo-item-actions';

      // Edit Action
      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn btn-edit';
      editBtn.setAttribute('aria-label', `Edit task: ${todo.text}`);
      editBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      `;
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditDialog(todo);
      });

      // Delete Action
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'icon-btn btn-delete';
      deleteBtn.setAttribute('aria-label', `Delete task: ${todo.text}`);
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      `;
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const confirmed = await showDeleteConfirmDialog(todo.text);
        if (confirmed) {
          // Animate item deletion slide out
          li.style.animation = 'fadeOut 0.25s ease-out forwards';
          li.addEventListener('animationend', () => {
            removeTodo(todo.id);
          });
        }
      });

      actionsArea.appendChild(editBtn);
      actionsArea.appendChild(deleteBtn);
      li.appendChild(actionsArea);

      todoList.appendChild(li);
    });
  }

  // --- EDIT TASK DIALOG MODAL ---
  function openEditDialog(todo) {
    editTodoId.value = todo.id;
    editTodoInput.value = todo.text;
    editTodoInput.classList.remove('invalid');
    editInputError.style.display = 'none';

    if (typeof editDialog.showModal === 'function') {
      editDialog.showModal();
    } else {
      editDialog.setAttribute('open', 'true');
    }
  }

  function closeEditDialog() {
    if (typeof editDialog.close === 'function') {
      editDialog.close();
    } else {
      editDialog.removeAttribute('open');
    }
  }

  // --- NATIVE EVENT LISTENERS ---

  // 1. Add Form submission
  addTodoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const textVal = todoInput.value.trim();
    if (!textVal) {
      todoInput.classList.add('invalid');
      inputError.style.display = 'block';
      return;
    }

    todoInput.classList.remove('invalid');
    inputError.style.display = 'none';

    const newItem = addTodo(textVal);

    if (newItem) {
      todoInput.value = '';

      // Intercept and answer WebMCP agent invocations declaratively
      if (e.agentInvoked && typeof e.respondWith === 'function') {
        e.respondWith(
          Promise.resolve({
            success: true,
            message: 'Task added successfully',
            task: newItem
          })
        );
      }
    }
  });

  // Clear errors when user types
  todoInput.addEventListener('input', () => {
    if (todoInput.value.trim()) {
      todoInput.classList.remove('invalid');
      inputError.style.display = 'none';
    }
  });

  // 2. Filter navigation buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      render();
    });
  });

  // 3. Edit Form submission
  editTodoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = editTodoId.value;
    const textVal = editTodoInput.value.trim();

    if (!textVal) {
      editTodoInput.classList.add('invalid');
      editInputError.style.display = 'block';
      return;
    }

    editTodoInput.classList.remove('invalid');
    editInputError.style.display = 'none';

    const updated = updateTodoText(id, textVal);
    if (updated) {
      closeEditDialog();
    }
  });

  // Clear edit dialog errors on typing
  editTodoInput.addEventListener('input', () => {
    if (editTodoInput.value.trim()) {
      editTodoInput.classList.remove('invalid');
      editInputError.style.display = 'none';
    }
  });

  // Cancel edit dialog button
  cancelEditBtn.addEventListener('click', closeEditDialog);

  // --- DELETE CONFIRMATION HELPERS & LISTENERS ---
  let deleteResolver = null;

  function showDeleteConfirmDialog(todoText) {
    deleteConfirmMessage.textContent = `Are you sure you want to delete the task: "${todoText}"?`;

    if (typeof deleteConfirmDialog.showModal === 'function') {
      deleteConfirmDialog.showModal();
    } else {
      deleteConfirmDialog.setAttribute('open', 'true');
    }

    return new Promise((resolve) => {
      deleteResolver = resolve;
    });
  }

  function closeDeleteConfirmDialog(confirmed) {
    if (typeof deleteConfirmDialog.close === 'function') {
      deleteConfirmDialog.close();
    } else {
      deleteConfirmDialog.removeAttribute('open');
    }
    if (deleteResolver) {
      deleteResolver(confirmed);
      deleteResolver = null;
    }
  }

  cancelDeleteBtn.addEventListener('click', () => closeDeleteConfirmDialog(false));
  confirmDeleteBtn.addEventListener('click', () => closeDeleteConfirmDialog(true));

  // --- WEBMCP TOOL REGISTRATION ---
  function registerWebMCPTools() {
    const controller = new AbortController();

    // Tool 0: get_todos
    document.modelContext.registerTool({
      name: 'get_todos',
      description: 'Retrieve the current list of todo items, including their IDs, description text, and completion status.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: () => {
        const items = getTodos();
        return { success: true, todos: items };
      },
      annotations: { readOnlyHint: true }
    }, { signal: controller.signal });

    // Tool 1: add_todo
    document.modelContext.registerTool({
      name: 'add_todo',
      description: 'Add a new task to the todo list.',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'The description of the new task.',
          },
        },
        required: ['text'],
      },
      execute: ({ text }) => {
        const newItem = addTodo(text);
        if (newItem) {
          return { success: true, message: 'Task added successfully', todo: newItem };
        }
        return { success: false, message: 'Failed to add task (text cannot be empty)' };
      },
    }, { signal: controller.signal });

    // Tool 2: edit_todo
    document.modelContext.registerTool({
      name: 'edit_todo',
      description: 'Edit the text description of an existing task on the todo list.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier of the task to edit.',
          },
          text: {
            type: 'string',
            description: 'The new text description for the task.',
          },
        },
        required: ['id', 'text'],
      },
      execute: ({ id, text }) => {
        const item = todos.find(t => t.id === id);
        if (!item) {
          return { success: false, message: `Task with ID "${id}" not found.` };
        }

        const res = updateTodoText(id, text);
        if (res) {
          return { success: true, message: `Task text updated to "${text}".`, todo: res };
        }
        return { success: false, message: 'Failed to update task text (cannot be empty).' };
      },
    }, { signal: controller.signal });

    // Tool 3: delete_todo
    document.modelContext.registerTool({
      name: 'delete_todo',
      description: 'Delete an existing task from the todo list.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier of the task to delete.',
          },
        },
        required: ['id'],
      },
      execute: async ({ id }) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) {
          return { success: false, message: `Task with ID "${id}" not found.` };
        }

        // Safety Guardrail: Deleting is destructive. Show confirmation dialog in the page UI.
        const confirmed = await showDeleteConfirmDialog(todo.text);

        if (!confirmed) {
          return { success: false, message: 'Task deletion cancelled by the user.' };
        }

        const removed = removeTodo(id);
        if (removed) {
          return { success: true, message: 'Task deleted successfully.' };
        }
        return { success: false, message: 'Failed to delete task.' };
      },
    }, { signal: controller.signal });

    // Tool 4: toggle_todo
    document.modelContext.registerTool({
      name: 'toggle_todo',
      description: 'Toggle the completion status of a task between active and completed.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier of the task to toggle.',
          },
        },
        required: ['id'],
      },
      execute: ({ id }) => {
        const item = todos.find(t => t.id === id);
        if (!item) {
          return { success: false, message: `Task with ID "${id}" not found.` };
        }
        const updated = toggleTodo(id);
        if (updated) {
          return { success: true, message: `Task status toggled successfully to ${updated.completed ? 'completed' : 'active'}.`, todo: updated };
        }
        return { success: false, message: 'Failed to toggle task status.' };
      },
    }, { signal: controller.signal });
  }

  // --- APPLICATION INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    render();
    registerWebMCPTools();
  });

})();
