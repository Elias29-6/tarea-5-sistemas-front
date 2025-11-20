const BASE = "https://tarea-5-sistemas-back.netlify.app/";

async function api(method, url, body) {
  const res = await fetch((BASE ? BASE : '') + '/.netlify/functions' + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

// ------- Authors -------
const authorsTbody = document.getElementById('authors-tbody');
const authorForm = document.getElementById('author-form');
const authorId = document.getElementById('author-id');
const authorName = document.getElementById('author-name');
const authorBio = document.getElementById('author-bio');
document.getElementById('author-cancel').onclick = () => {
  authorId.value = ''; authorName.value=''; authorBio.value='';
};

async function loadAuthors() {
  const list = await api('GET', '/authors');
  authorsTbody.innerHTML = list.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.name}</td>
      <td>${a.bio||''}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-1" data-edit-author="${a.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-del-author="${a.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

authorForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = authorId.value.trim();
  const payload = { name: authorName.value, bio: authorBio.value };
  if (id) {
    await api('PUT', `/authors/${id}`, payload);
  } else {
    await api('POST', `/authors`, payload);
  }
  authorId.value=''; authorName.value=''; authorBio.value='';
  await loadAuthors();
};

authorsTbody.addEventListener('click', async (e) => {
  const editId = e.target.getAttribute('data-edit-author');
  const delId = e.target.getAttribute('data-del-author');
  if (editId) {
    const list = await api('GET', '/authors');
    const a = list.find(x => String(x.id) === String(editId));
    if (a) {
      authorId.value = a.id;
      authorName.value = a.name;
      authorBio.value = a.bio || '';
    }
  } else if (delId) {
    if (confirm('¿Eliminar autor #' + delId + '?')) {
      await api('DELETE', `/authors/${delId}`);
      await loadAuthors();
    }
  }
});

// ------- Editorials -------
const editorialsTbody = document.getElementById('editorials-tbody');
const editorialForm = document.getElementById('editorial-form');
const editorialId = document.getElementById('editorial-id');
const editorialName = document.getElementById('editorial-name');
const editorialCountry = document.getElementById('editorial-country');
document.getElementById('editorial-cancel').onclick = () => {
  editorialId.value=''; editorialName.value=''; editorialCountry.value='';
};

async function loadEditorials() {
  const list = await api('GET', '/editorials');
  editorialsTbody.innerHTML = list.map(e => `
    <tr>
      <td>${e.id}</td>
      <td>${e.name}</td>
      <td>${e.country||''}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-1" data-edit-editorial="${e.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-del-editorial="${e.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

editorialForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = editorialId.value.trim();
  const payload = { name: editorialName.value, country: editorialCountry.value };
  if (id) {
    await api('PUT', `/editorials/${id}`, payload);
  } else {
    await api('POST', `/editorials`, payload);
  }
  editorialId.value=''; editorialName.value=''; editorialCountry.value='';
  await loadEditorials();
};

editorialsTbody.addEventListener('click', async (e) => {
  const editId = e.target.getAttribute('data-edit-editorial');
  const delId = e.target.getAttribute('data-del-editorial');
  if (editId) {
    const list = await api('GET', '/editorials');
    const item = list.find(x => String(x.id) === String(editId));
    if (item) {
      editorialId.value = item.id;
      editorialName.value = item.name;
      editorialCountry.value = item.country || '';
    }
  } else if (delId) {
    if (confirm('¿Eliminar editorial #' + delId + '?')) {
      await api('DELETE', `/editorials/${delId}`);
      await loadEditorials();
    }
  }
});

// initial bootstrap
await loadAuthors();
await loadEditorials();
