(function () {
  'use strict';

  var LEGACY_KEY = 'todos'; // 예전 localStorage 키 (최초 로그인 시 DB로 이전)
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
        title: t.title.trim().slice(0, 500),
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

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 3) | 8).toString(16);
    });
  }

  function formatDue(dateStr) {
    return dateStr.slice(5, 7) + '/' + dateStr.slice(8, 10);
  }

  // DB 행 <-> 앱 모델 변환
  function rowToTodo(r) {
    return {
      id: r.id,
      title: r.title,
      done: r.done === true,
      priority: PRIORITY_ORDER.hasOwnProperty(r.priority) ? r.priority : 'medium',
      dueDate: r.due_date || null,
      createdAt: Date.parse(r.created_at) || 0
    };
  }

  function todoToRow(t) {
    return {
      id: t.id,
      title: t.title,
      done: t.done,
      priority: t.priority,
      due_date: t.dueDate || null,
      created_at: new Date(t.createdAt).toISOString()
    };
  }

  // 예전 localStorage 항목 -> DB 삽입용 행 (id는 새 UUID, 시간은 가능하면 보존)
  function legacyToRows(items) {
    return sanitize(items).map(function (t) {
      var ts = t.createdAt > 1e12 ? t.createdAt : Date.now() + t.createdAt;
      return todoToRow({
        id: uuid(), title: t.title, done: t.done, priority: t.priority,
        dueDate: t.dueDate, createdAt: ts
      });
    });
  }

  var api = {
    todayString: todayString,
    isOverdue: isOverdue,
    compareTodos: compareTodos,
    filterTodos: filterTodos,
    sanitize: sanitize,
    formatDue: formatDue,
    rowToTodo: rowToTodo,
    todoToRow: todoToRow,
    legacyToRows: legacyToRows
  };

  if (typeof document === 'undefined') {
    if (typeof module !== 'undefined') module.exports = api;
    return;
  }

  /* ---------- Supabase ---------- */

  var cfg = window.SUPABASE_CONFIG;
  var sb = null;
  try {
    if (cfg && window.supabase) {
      sb = window.supabase.createClient(cfg.url, cfg.key, {
        auth: {
          // 기본 탭 간 잠금(navigator.locks)은 환경에 따라 인증 초기화가 멈추는 경우가 있어
          // (측정: 8회 중 6회 멈춤) 잠금 없이 실행한다. 단일 사용자 앱이라 영향이 작다.
          lock: function (name, acquireTimeout, fn) { return fn(); }
        }
      });
    }
  } catch (e) {
    sb = null;
  }

  /* ---------- 상태 ---------- */

  var todos = [];
  var loaded = false;
  var userId = null;
  var filter = 'all';
  var query = '';
  var editingId = null;
  var statusTimer = null;

  /* ---------- DOM 참조 ---------- */

  var $ = function (id) { return document.getElementById(id); };
  var authView = $('auth-view');
  var appView = $('app-view');
  var userBar = $('user-bar');
  var userEmail = $('user-email');
  var statusEl = $('status');
  var authForm = $('auth-form');
  var authEmail = $('auth-email');
  var authPassword = $('auth-password');
  var authMessage = $('auth-message');
  var loginBtn = $('login-btn');
  var signupBtn = $('signup-btn');
  var logoutBtn = $('logout');
  var form = $('add-form');
  var titleInput = $('title-input');
  var priorityInput = $('priority-input');
  var dueInput = $('due-input');
  var searchInput = $('search-input');
  var filterButtons = document.querySelectorAll('.filters button');
  var listEl = $('list');
  var emptyEl = $('empty');
  var remainingEl = $('remaining');
  var clearDoneBtn = $('clear-done');

  /* ---------- 알림 ---------- */

  function setStatus(msg) {
    clearTimeout(statusTimer);
    if (!msg) { statusEl.hidden = true; return; }
    statusEl.textContent = msg;
    statusEl.hidden = false;
    statusTimer = setTimeout(function () { statusEl.hidden = true; }, 6000);
  }

  function setAuthMessage(msg) {
    authMessage.textContent = msg || '';
    authMessage.hidden = !msg;
  }

  /* ---------- 화면 전환 ---------- */

  function showAuth() {
    userId = null;
    todos = [];
    loaded = false;
    editingId = null;
    appView.hidden = true;
    userBar.hidden = true;
    authView.hidden = false;
  }

  function showApp(user) {
    authView.hidden = true;
    appView.hidden = false;
    userBar.hidden = false;
    userEmail.textContent = user.email || '';
  }

  /* ---------- DB 접근 ---------- */

  function refresh() {
    return sb.from('todos').select('*').order('created_at', { ascending: true })
      .then(function (res) {
        if (res.error) throw res.error;
        todos = res.data.map(rowToTodo);
        loaded = true;
        render();
      })
      .catch(function () {
        loaded = true;
        render();
        setStatus('할 일을 불러오지 못했습니다. 네트워크를 확인해 주세요.');
      });
  }

  // 쓰기 작업: 화면은 먼저 바꿔 두고, 실패하면 서버 상태로 되돌린다.
  function write(request, failMessage) {
    return Promise.resolve(request)
      .then(function (res) {
        if (res.error) throw res.error;
      })
      .catch(function () {
        setStatus(failMessage);
        return refresh();
      });
  }

  function migrateLegacy() {
    var items = [];
    try {
      var text = localStorage.getItem(LEGACY_KEY);
      if (text) items = JSON.parse(text);
    } catch (e) {
      items = [];
    }
    var rows = legacyToRows(items);
    if (rows.length === 0) {
      try { localStorage.removeItem(LEGACY_KEY); } catch (e) { /* 무시 */ }
      return Promise.resolve();
    }
    return sb.from('todos').insert(rows).then(function (res) {
      if (res.error) throw res.error;
      try { localStorage.removeItem(LEGACY_KEY); } catch (e) { /* 무시 */ }
      setStatus('이 브라우저에 있던 할 일 ' + rows.length + '개를 계정으로 옮겼습니다.');
    }).catch(function () {
      // 실패 시 localStorage는 그대로 두어 다음 접속에서 다시 시도
      setStatus('기존 할 일을 옮기지 못했습니다. 다음 접속 때 다시 시도합니다.');
    });
  }

  function startSession(user) {
    userId = user.id;
    todos = [];
    loaded = false;
    showApp(user);
    render();
    migrateLegacy().then(refresh);
  }

  /* ---------- 동작 ---------- */

  function findTodo(id) {
    for (var i = 0; i < todos.length; i++) if (todos[i].id === id) return todos[i];
    return null;
  }

  function addTodo(title, priority, dueDate) {
    var clean = title.trim();
    if (!clean) return false;
    var todo = {
      id: uuid(),
      title: clean.slice(0, 500),
      done: false,
      priority: PRIORITY_ORDER.hasOwnProperty(priority) ? priority : 'medium',
      dueDate: dueDate || null,
      createdAt: Date.now()
    };
    todos.push(todo);
    render();
    write(sb.from('todos').insert(todoToRow(todo)), '추가하지 못했습니다. 다시 시도해 주세요.');
    return true;
  }

  function toggleTodo(id) {
    var t = findTodo(id);
    if (!t) return;
    t.done = !t.done;
    render();
    write(sb.from('todos').update({ done: t.done }).eq('id', id), '변경하지 못했습니다. 다시 시도해 주세요.');
  }

  function deleteTodo(id) {
    todos = todos.filter(function (t) { return t.id !== id; });
    if (editingId === id) editingId = null;
    render();
    write(sb.from('todos').delete().eq('id', id), '삭제하지 못했습니다. 다시 시도해 주세요.');
  }

  function clearDone() {
    todos = todos.filter(function (t) { return !t.done; });
    render();
    write(sb.from('todos').delete().eq('done', true), '삭제하지 못했습니다. 다시 시도해 주세요.');
  }

  function updateTitle(id, title) {
    var t = findTodo(id);
    var clean = title.trim().slice(0, 500);
    if (t && clean && clean !== t.title) {
      t.title = clean;
      write(sb.from('todos').update({ title: clean }).eq('id', id), '수정하지 못했습니다. 다시 시도해 주세요.');
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
    input.maxLength = 500;
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

    var editBtn = el('button', 'text-btn', '수정');
    editBtn.type = 'button';
    editBtn.setAttribute('aria-label', '수정: ' + todo.title);
    editBtn.addEventListener('click', function () { startEdit(todo.id); });
    li.appendChild(editBtn);

    var delBtn = el('button', 'text-btn', '삭제');
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', '삭제: ' + todo.title);
    delBtn.addEventListener('click', function () { deleteTodo(todo.id); });
    li.appendChild(delBtn);

    return li;
  }

  function render() {
    if (appView.hidden) return;
    var today = todayString();
    var visible = filterTodos(todos, filter, query).sort(compareTodos);

    listEl.textContent = '';
    visible.forEach(function (t) { listEl.appendChild(buildItem(t, today)); });

    if (!loaded) {
      emptyEl.hidden = false;
      emptyEl.textContent = '불러오는 중…';
    } else if (visible.length === 0) {
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

  /* ---------- 인증 ---------- */

  function authErrorText(err) {
    var msg = (err && err.message) || '';
    if (/invalid login credentials/i.test(msg)) return '이메일 또는 비밀번호가 올바르지 않습니다.';
    if (/email not confirmed/i.test(msg)) return '이메일 인증이 아직 끝나지 않았습니다. 받은 메일의 링크를 눌러 주세요.';
    if (/already registered/i.test(msg)) return '이미 가입된 이메일입니다. 로그인해 주세요.';
    if (/password/i.test(msg) && /(least|short|weak)/i.test(msg)) return '비밀번호는 6자 이상이어야 합니다.';
    if (/rate limit/i.test(msg)) return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    return '처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  function readCredentials() {
    var email = authEmail.value.trim();
    var password = authPassword.value;
    if (!email || email.indexOf('@') === -1) { setAuthMessage('이메일 주소를 입력해 주세요.'); authEmail.focus(); return null; }
    if (password.length < 6) { setAuthMessage('비밀번호는 6자 이상이어야 합니다.'); authPassword.focus(); return null; }
    return { email: email, password: password };
  }

  function setAuthBusy(busy) {
    loginBtn.disabled = busy;
    signupBtn.disabled = busy;
  }

  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    setAuthMessage('');
    var cred = readCredentials();
    if (!cred) return;
    setAuthBusy(true);
    sb.auth.signInWithPassword(cred).then(function (res) {
      if (res.error) setAuthMessage(authErrorText(res.error));
      else authPassword.value = '';
    }).catch(function () {
      setAuthMessage('서버에 연결하지 못했습니다. 네트워크를 확인해 주세요.');
    }).then(function () { setAuthBusy(false); });
  });

  signupBtn.addEventListener('click', function () {
    setAuthMessage('');
    var cred = readCredentials();
    if (!cred) return;
    setAuthBusy(true);
    sb.auth.signUp(cred).then(function (res) {
      if (res.error) { setAuthMessage(authErrorText(res.error)); return; }
      if (!res.data.session) {
        setAuthMessage('가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요.');
      } else {
        authPassword.value = '';
      }
    }).catch(function () {
      setAuthMessage('서버에 연결하지 못했습니다. 네트워크를 확인해 주세요.');
    }).then(function () { setAuthBusy(false); });
  });

  logoutBtn.addEventListener('click', function () {
    sb.auth.signOut().then(function () { showAuth(); });
  });

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

  // 탭으로 돌아오면 다른 기기에서 바꾼 내용을 다시 불러오고, 자정 이후 지연 판정도 갱신
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && userId && editingId === null) refresh();
  });

  /* ---------- 시작 ---------- */

  if (!sb) {
    showAuth();
    setAuthBusy(true);
    setAuthMessage('서버에 연결할 수 없습니다. 인터넷 연결을 확인하고 새로고침해 주세요.');
    return;
  }

  // 안전장치: 인증 상태 확인이 5초 넘게 끝나지 않으면 빈 화면 대신 로그인 화면을 보여 준다.
  // (이후 세션이 확인되면 아래 핸들러가 앱 화면으로 바꾼다.)
  setTimeout(function () {
    if (authView.hidden && appView.hidden) showAuth();
  }, 5000);

  sb.auth.onAuthStateChange(function (event, session) {
    // 콜백 안에서 바로 Supabase 호출을 하면 교착될 수 있어 다음 틱으로 넘긴다.
    setTimeout(function () {
      if (!session) {
        if (userId !== null || authView.hidden) showAuth();
        return;
      }
      if (session.user.id !== userId) startSession(session.user);
    }, 0);
  });
})();
