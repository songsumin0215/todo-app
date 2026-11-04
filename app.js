(function () {
  'use strict';

  var STORAGE_KEY = 'todos';
  var PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
  var PRIORITY_LABEL = { high: '높음', medium: '보통', low: '낮음' };

  /* ---------- 순수 로직 (DOM 없이 테스트 가능) ---------- */

  function todayString(now) {
    var d = now || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function isOverdue(todo, today) {
    return !todo.done && !!todo.dueDate && todo.dueDate < today;
  }

  function compareTodos(a, b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.dueDate !== b.dueDate) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    }
    if (a.priority !== b.priority) return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return a.createdAt - b.createdAt;
  }

  function filterTodos(todos, filter, query) {
    var q = (query || '').trim().toLowerCase();
    return todos.filter(function (t) {
      if (filter === 'active' && t.done) return false;
      if (filter === 'done' && !t.done) return false;
      if (q && t.title.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function sanitize(raw) {
    if (!Array.isArray(raw)) return [];
    var result = [];
    raw.forEach(function (t, i) {
      if (!t || typeof t.title !== 'string' || !t.title.trim()) return;
      result.push({
        id: typeof t.id === 'string' && t.id ? t.id : makeId(),
        title: t.title.trim(),
        done: t.done === true,
        priority: PRIORITY_ORDER.hasOwnProperty(t.priority) ? t.priority : 'medium',
        dueDate: typeof t.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate) ? t.dueDate : null,
        createdAt: typeof t.createdAt === 'number' ? t.createdAt : i
      });
    });
    return result;
  }

  var idCounter = 0;
  function makeId() {
    idCounter += 1;
    return Date.now().toString(36) + '-' + idCounter + '-' + Math.random().toString(36).slice(2, 8);
  }

  function formatDue(dateStr) {
    return dateStr.slice(5, 7) + '/' + dateStr.slice(8, 10);
  }

  var api = {
    todayString: todayString,
    isOverdue: isOverdue,
    compareTodos: compareTodos,
    filterTodos: filterTodos,
    sanitize: sanitize,
    formatDue: formatDue
  };

  if (typeof document === 'undefined') {
    if (typeof module !== 'undefined') module.exports = api;
    return;
  }

  /* ---------- 저장 ---------- */

  function loadTodos() {
    try {
      var text = localStorage.getItem(STORAGE_KEY);
      if (!text) return [];
      return sanitize(JSON.parse(text));
    } catch (e) {
      return [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      /* 저장 실패해도 앱은 계속 동작 */
    }
  }

  /* ---------- 상태 ---------- */

  var todos = loadTodos();
  var filter = 'all';
  var query = '';
  var editingId = null;

  /* ---------- DOM 참조 ---------- */

  var form = document.getElementById('add-form');
  var titleInput = document.getElementById('title-input');
  var priorityInput = document.getElementById('priority-input');
  var dueInput = document.getElementById('due-input');
  var searchInput = document.getElementById('search-input');
  var filterButtons = document.querySelectorAll('.filters button');
  var listEl = document.getElementById('list');
  var emptyEl = document.getElementById('empty');
  var remainingEl = document.getElementById('remaining');
  var clearDoneBtn = document.getElementById('clear-done');

  /* ---------- 동작 ---------- */

  function addTodo(title, priority, dueDate) {
    var clean = title.trim();
    if (!clean) return false;
    todos.push({
      id: makeId(),
      title: clean,
      done: false,
      priority: PRIORITY_ORDER.hasOwnProperty(priority) ? priority : 'medium',
      dueDate: dueDate || null,
      createdAt: Date.now()
    });
    saveTodos();
    render();
    return true;
  }

  function findTodo(id) {
    for (var i = 0; i < todos.length; i++) if (todos[i].id === id) return todos[i];
    return null;
  }

  function toggleTodo(id) {
    var t = findTodo(id);
    if (!t) return;
    t.done = !t.done;
    saveTodos();
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter(function (t) { return t.id !== id; });
    if (editingId === id) editingId = null;
    saveTodos();
    render();
  }

  function clearDone() {
    todos = todos.filter(function (t) { return !t.done; });
    saveTodos();
    render();
  }

  function updateTitle(id, title) {
    var t = findTodo(id);
    var clean = title.trim();
    if (t && clean) {
      t.title = clean;
      saveTodos();
    }
  }

  /* ---------- 렌더링 ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function startEdit(id) {
    editingId = id;
    render();
    var input = listEl.querySelector('.edit-input');
    if (input) {
      input.focus();
      input.select();
    }
  }

  function buildEditInput(todo) {
    var input = el('input', 'edit-input');
    input.type = 'text';
    input.value = todo.title;
    input.setAttribute('aria-label', '제목 수정');
    var finished = false;

    function finish(save) {
      if (finished) return;
      finished = true;
      if (save) updateTitle(todo.id, input.value);
      editingId = null;
      render();
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
    });
    input.addEventListener('blur', function () { finish(true); });
    return input;
  }

  function buildItem(todo, today) {
    var li = el('li', 'item' + (todo.done ? ' done' : ''));

    var check = el('input');
    check.type = 'checkbox';
    check.checked = todo.done;
    check.setAttribute('aria-label', '완료: ' + todo.title);
    check.addEventListener('change', function () { toggleTodo(todo.id); });
    li.appendChild(check);

    var dot = el('span', 'dot ' + todo.priority);
    dot.title = '우선순위 ' + PRIORITY_LABEL[todo.priority];
    dot.setAttribute('role', 'img');
    dot.setAttribute('aria-label', '우선순위 ' + PRIORITY_LABEL[todo.priority]);
    li.appendChild(dot);

    if (editingId === todo.id) {
      li.appendChild(buildEditInput(todo));
    } else {
      var title = el('span', 'title', todo.title);
      title.addEventListener('dblclick', function () { startEdit(todo.id); });
      li.appendChild(title);
    }

    if (todo.dueDate) {
      var overdue = isOverdue(todo, today);
      var due = el('span', 'due' + (overdue ? ' overdue' : ''), formatDue(todo.dueDate));
      due.title = overdue ? '마감 지남: ' + todo.dueDate : '마감일: ' + todo.dueDate;
      li.appendChild(due);
    }

    var editBtn = el('button', 'icon-btn', '✎');
    editBtn.type = 'button';
    editBtn.setAttribute('aria-label', '수정: ' + todo.title);
    editBtn.addEventListener('click', function () { startEdit(todo.id); });
    li.appendChild(editBtn);

    var delBtn = el('button', 'icon-btn', '🗑');
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', '삭제: ' + todo.title);
    delBtn.addEventListener('click', function () { deleteTodo(todo.id); });
    li.appendChild(delBtn);

    return li;
  }

  function render() {
    var today = todayString();
    var visible = filterTodos(todos, filter, query).sort(compareTodos);

    listEl.textContent = '';
    visible.forEach(function (t) { listEl.appendChild(buildItem(t, today)); });

    if (visible.length === 0) {
      emptyEl.hidden = false;
      emptyEl.textContent = todos.length === 0 ? '할 일이 없습니다. 위에서 추가해 보세요.' : '표시할 항목이 없습니다';
    } else {
      emptyEl.hidden = true;
    }

    var remaining = todos.filter(function (t) { return !t.done; }).length;
    remainingEl.textContent = '남은 할 일 ' + remaining + '개';
    clearDoneBtn.disabled = !todos.some(function (t) { return t.done; });

    filterButtons.forEach(function (b) {
      var on = b.getAttribute('data-filter') === filter;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------- 이벤트 ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (addTodo(titleInput.value, priorityInput.value, dueInput.value)) {
      titleInput.value = '';
    }
    titleInput.focus();
  });

  searchInput.addEventListener('input', function () {
    query = searchInput.value;
    render();
  });

  filterButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.getAttribute('data-filter');
      render();
    });
  });

  clearDoneBtn.addEventListener('click', clearDone);

  // 다른 탭 변경 반영 + 자정 이후 탭 복귀 시 지연 판정 갱신
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY && editingId === null) {
      todos = loadTodos();
      render();
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && editingId === null) render();
  });

  render();
})();
