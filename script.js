// ====== DATA ======
// Semua tugas disimpan di dalam array ini
// Bentuk tiap item: { id, text, done, selected }
let todos = [];
let nextId = 1; // id unik yang terus bertambah, tidak dipakai ulang

// ====== ELEMEN DOM ======
// Form input (dipakai untuk tambah sekaligus edit)
const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const editIdInput = document.getElementById("editId"); // hidden input, berisi id saat mode edit
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Daftar tugas
const list = document.getElementById("todoList");

// Kontrol aksi massal
const checkAll = document.getElementById("checkAll");
const massDoneBtn = document.getElementById("massDoneBtn");
const massUndoneBtn = document.getElementById("massUndoneBtn");
const massDeleteBtn = document.getElementById("massDeleteBtn");

// Tombol dummy
const dummyBtn = document.getElementById("dummyBtn");

// ====== CREATE ======
// Tambah tugas baru ke array
function addTodo(text) {
  todos.push({ id: nextId++, text: text, done: false, selected: false });
  render();
}

// ====== UPDATE ======
// Ubah teks tugas berdasarkan id
function updateTodo(id, newText) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.text = newText;
    render();
  }
}

// Balik status selesai / belum selesai
function toggleDone(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    render();
  }
}

// Centang / lepas centang satu tugas
function toggleSelect(id, checked) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.selected = checked;
    render();
  }
}

// ====== DELETE ======
// Hapus satu tugas berdasarkan id
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  render();
}

// ====== AKSI MASSAL (berdasarkan ceklis) ======
// Ambil semua tugas yang sedang dicentang
function getSelected() {
  return todos.filter((t) => t.selected);
}

// Tandai semua yang dicentang sebagai selesai, lalu lepas centangnya
function massDone() {
  getSelected().forEach((t) => {
    t.done = true;
    t.selected = false;
  });
  render();
}

// Kembalikan semua yang dicentang menjadi belum selesai
function massUndone() {
  getSelected().forEach((t) => {
    t.done = false;
    t.selected = false;
  });
  render();
}

// Hapus semua yang dicentang
function massDelete() {
  todos = todos.filter((t) => !t.selected);
  render();
}

// Centang / lepas centang semua tugas sekaligus
function selectAll(checked) {
  todos.forEach((t) => (t.selected = checked));
  render();
}

// ====== DATA DUMMY ======
// Daftar teks contoh untuk keperluan uji coba
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

// Masukkan 10 tugas dummy ke array (bisa dipanggil berulang)
function generateDummy() {
  dummyTasks.forEach((text, i) => {
    const id = nextId++;
    todos.push({
      id: id,
      text: text + " #" + id, // tambahkan nomor id agar tiap item mudah dibedakan
      done: i % 3 === 0, // sebagian ditandai selesai agar bervariasi
      selected: false,
    });
  });
  render();
}

// ====== MODE EDIT ======
// Isi form dengan data tugas dan ubah tampilan tombol menjadi "Simpan"
function startEdit(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  editIdInput.value = id; // tandai bahwa form sedang mode edit
  input.value = todo.text;
  submitBtn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan';
  submitBtn.classList.replace("btn-primary", "btn-success");
  cancelBtn.classList.remove("d-none");
  input.focus();
}

// Kosongkan form dan kembalikan tombol ke mode "Tambah"
function cancelEdit() {
  editIdInput.value = "";
  input.value = "";
  submitBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Tambah';
  submitBtn.classList.replace("btn-success", "btn-primary");
  cancelBtn.classList.add("d-none");
}

// ====== RENDER ======
// Gambar ulang seluruh tampilan dari isi array todos
function render() {
  list.innerHTML = ""; // kosongkan list lalu bangun ulang

  // Buat satu <li> untuk tiap tugas
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item todo-item d-flex align-items-center gap-2" +
      (todo.done ? " done" : "");
    li.dataset.id = todo.id; // simpan id di atribut data-id untuk dipakai event handler
    li.innerHTML =
      '<input type="checkbox" class="form-check-input mt-0 select-check" ' +
      (todo.selected ? "checked" : "") +
      ' title="Pilih">' +
      '<span class="todo-text flex-grow-1" title="Klik untuk tandai selesai">' +
      todo.text +
      "</span>" +
      (todo.done ? '<span class="badge text-bg-success">Selesai</span>' : "") +
      '<div class="todo-actions btn-group btn-group-sm">' +
      '<button type="button" class="btn btn-outline-secondary edit-btn" title="Edit"><i class="bi bi-pencil"></i></button>' +
      '<button type="button" class="btn btn-outline-danger delete-btn" title="Hapus"><i class="bi bi-trash"></i></button>' +
      "</div>";
    list.appendChild(li);
  });

  // Status pilihan & tombol massal
  const selected = getSelected().length;
  massDoneBtn.disabled = selected === 0; // tombol massal aktif hanya jika ada yang dicentang
  massUndoneBtn.disabled = selected === 0;
  massDeleteBtn.disabled = selected === 0;
  checkAll.checked = todos.length > 0 && selected === todos.length; // semua tercentang
  checkAll.indeterminate = selected > 0 && selected < todos.length; // sebagian tercentang
  checkAll.disabled = todos.length === 0;
}

// ====== EVENT ======
// Submit form: tambah tugas baru, atau simpan perubahan jika sedang mode edit
form.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah reload halaman
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

// Batalkan mode edit
cancelBtn.addEventListener("click", cancelEdit);

// Event delegation untuk item di dalam list
// Satu listener di <ul> menangani klik semua item, termasuk yang dibuat belakangan
list.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.closest(".edit-btn")) {
    startEdit(id);
  } else if (e.target.closest(".delete-btn")) {
    deleteTodo(id);
  } else if (e.target.classList.contains("todo-text")) {
    toggleDone(id); // klik teks = toggle selesai
  }
});

// Checkbox per item berubah
list.addEventListener("change", (e) => {
  if (e.target.classList.contains("select-check")) {
    const id = Number(e.target.closest(".todo-item").dataset.id);
    toggleSelect(id, e.target.checked);
  }
});

// Kontrol massal & tombol dummy
checkAll.addEventListener("change", (e) => selectAll(e.target.checked));
massDoneBtn.addEventListener("click", massDone);
massUndoneBtn.addEventListener("click", massUndone);
massDeleteBtn.addEventListener("click", massDelete);
dummyBtn.addEventListener("click", generateDummy);

// Render awal saat halaman dimuat
render();
