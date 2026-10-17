// ====== DATA ======
// Semua tugas disimpan di dalam array ini
let todos = [];
let nextId = 1;

// ====== ELEMEN DOM ======
const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const editIdInput = document.getElementById("editId");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const list = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const checkAll = document.getElementById("checkAll");
const massDoneBtn = document.getElementById("massDoneBtn");
const massUndoneBtn = document.getElementById("massUndoneBtn");
const massDeleteBtn = document.getElementById("massDeleteBtn");
const stats = document.getElementById("stats");
const selectedCount = document.getElementById("selectedCount");
const dummyBtn = document.getElementById("dummyBtn");

// ====== CREATE ======
function addTodo(text) {
  todos.push({ id: nextId++, text: text, done: false, selected: false });
  render();
}

// ====== UPDATE ======
function updateTodo(id, newText) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.text = newText;
    render();
  }
}

function toggleDone(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    render();
  }
}

function toggleSelect(id, checked) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.selected = checked;
    render();
  }
}

// ====== DELETE ======
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  render();
}

// ====== AKSI MASSAL (berdasarkan ceklis) ======
function getSelected() {
  return todos.filter((t) => t.selected);
}

function massDone() {
  getSelected().forEach((t) => {
    t.done = true;
    t.selected = false;
  });
  render();
}

function massUndone() {
  getSelected().forEach((t) => {
    t.done = false;
    t.selected = false;
  });
  render();
}

function massDelete() {
  const count = getSelected().length;
  if (count === 0) return;
  if (!confirm("Hapus " + count + " tugas yang dipilih?")) return;
  todos = todos.filter((t) => !t.selected);
  render();
}

function selectAll(checked) {
  todos.forEach((t) => (t.selected = checked));
  render();
}

// ====== DATA DUMMY ======
const dummyTasks = [
  "Belajar JavaScript dasar",
  "Membaca dokumentasi Bootstrap",
  "Mengerjakan tugas kuliah",
  "Olahraga pagi 30 menit",
  "Belanja kebutuhan mingguan",
  "Membersihkan kamar",
  "Menyiapkan presentasi proyek",
  "Membalas email penting",
  "Menyiram tanaman",
  "Menyusun jadwal minggu depan",
];

function generateDummy() {
  dummyTasks.forEach((text, i) => {
    const id = nextId++;
    todos.push({
      id: id,
      text: text + " #" + id,
      done: i % 3 === 0, // sebagian ditandai selesai agar bervariasi
      selected: false,
    });
  });
  render();
}

// ====== MODE EDIT ======
function startEdit(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  editIdInput.value = id;
  input.value = todo.text;
  submitBtn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan';
  submitBtn.classList.replace("btn-primary", "btn-success");
  cancelBtn.classList.remove("d-none");
  input.focus();
}

function cancelEdit() {
  editIdInput.value = "";
  input.value = "";
  submitBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Tambah';
  submitBtn.classList.replace("btn-success", "btn-primary");
  cancelBtn.classList.add("d-none");
}

// ====== RENDER ======
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "list-group-item todo-item d-flex align-items-center gap-2" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;
    li.innerHTML =
      '<input type="checkbox" class="form-check-input mt-0 select-check" ' + (todo.selected ? "checked" : "") + ' title="Pilih">' +
      '<span class="todo-text flex-grow-1" title="Klik untuk tandai selesai">' + escapeHtml(todo.text) + "</span>" +
      (todo.done ? '<span class="badge text-bg-success">Selesai</span>' : "") +
      '<div class="todo-actions btn-group btn-group-sm">' +
      '<button type="button" class="btn btn-outline-secondary edit-btn" title="Edit"><i class="bi bi-pencil"></i></button>' +
      '<button type="button" class="btn btn-outline-danger delete-btn" title="Hapus"><i class="bi bi-trash"></i></button>' +
      "</div>";
    list.appendChild(li);
  });

  // Empty state
  emptyState.classList.toggle("d-none", todos.length > 0);

  // Statistik
  const doneCount = todos.filter((t) => t.done).length;
  stats.textContent = todos.length + " tugas, " + doneCount + " selesai";

  // Status pilihan & tombol massal
  const selected = getSelected().length;
  selectedCount.textContent = selected > 0 ? selected + " dipilih" : "";
  massDoneBtn.disabled = selected === 0;
  massUndoneBtn.disabled = selected === 0;
  massDeleteBtn.disabled = selected === 0;
  checkAll.checked = todos.length > 0 && selected === todos.length;
  checkAll.indeterminate = selected > 0 && selected < todos.length;
  checkAll.disabled = todos.length === 0;
}

// ====== EVENT ======
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const editId = Number(editIdInput.value);
  if (editId) {
    updateTodo(editId, text);
    cancelEdit();
  } else {
    addTodo(text);
    input.value = "";
  }
  input.focus();
});

cancelBtn.addEventListener("click", cancelEdit);

// Event delegation untuk item di dalam list
list.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.closest(".edit-btn")) {
    startEdit(id);
  } else if (e.target.closest(".delete-btn")) {
    if (confirm("Hapus tugas ini?")) deleteTodo(id);
  } else if (e.target.classList.contains("todo-text")) {
    toggleDone(id);
  }
});

list.addEventListener("change", (e) => {
  if (e.target.classList.contains("select-check")) {
    const id = Number(e.target.closest(".todo-item").dataset.id);
    toggleSelect(id, e.target.checked);
  }
});

checkAll.addEventListener("change", (e) => selectAll(e.target.checked));
massDoneBtn.addEventListener("click", massDone);
massUndoneBtn.addEventListener("click", massUndone);
massDeleteBtn.addEventListener("click", massDelete);
dummyBtn.addEventListener("click", generateDummy);

// Render awal
render();
