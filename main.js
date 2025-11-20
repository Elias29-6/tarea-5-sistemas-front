const API_BASE = ""; 
// When frontend is hosted elsewhere, set this to your Netlify site URL, e.g.:
// const API_BASE = "https://tu-sitio-netlify.netlify.app";

async function api(method, path, body) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

// ===== Authors =====
const authorForm = document.getElementById("author-form");
const authorIdInput = document.getElementById("author-id");
const authorNameInput = document.getElementById("author-name");
const authorBioInput = document.getElementById("author-bio");
const authorsTbody = document.getElementById("authors-tbody");
document.getElementById("author-reset").onclick = () => {
  authorIdInput.value = "";
  authorNameInput.value = "";
  authorBioInput.value = "";
};

authorForm.onsubmit = async (e) => {
  e.preventDefault();
  const payload = {
    name: authorNameInput.value,
    bio: authorBioInput.value,
  };
  try {
    if (authorIdInput.value) {
      await api("PUT", `/.netlify/functions/authors/${authorIdInput.value}`, payload);
    } else {
      await api("POST", "/.netlify/functions/authors", payload);
    }
    authorIdInput.value = "";
    authorNameInput.value = "";
    authorBioInput.value = "";
    await loadAuthors();
  } catch (err) {
    alert("Error saving author: " + err.message);
  }
};

async function loadAuthors() {
  try {
    const authors = await api("GET", "/.netlify/functions/authors");
    authorsTbody.innerHTML = "";
    authors.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.name}</td>
        <td>${a.bio || ""}</td>
        <td class="actions"></td>
      `;
      const actionsTd = tr.querySelector(".actions");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        authorIdInput.value = a.id;
        authorNameInput.value = a.name;
        authorBioInput.value = a.bio || "";
      };
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        if (!confirm("Delete this author?")) return;
        try {
          await api("DELETE", `/.netlify/functions/authors/${a.id}`);
          await loadAuthors();
        } catch (err) {
          alert("Error deleting author: " + err.message);
        }
      };
      actionsTd.append(editBtn, delBtn);
      authorsTbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading authors:", err);
  }
}

// ===== Editorials =====
const editorialForm = document.getElementById("editorial-form");
const editorialIdInput = document.getElementById("editorial-id");
const editorialNameInput = document.getElementById("editorial-name");
const editorialCountryInput = document.getElementById("editorial-country");
const editorialsTbody = document.getElementById("editorials-tbody");
document.getElementById("editorial-reset").onclick = () => {
  editorialIdInput.value = "";
  editorialNameInput.value = "";
  editorialCountryInput.value = "";
};

editorialForm.onsubmit = async (e) => {
  e.preventDefault();
  const payload = {
    name: editorialNameInput.value,
    country: editorialCountryInput.value,
  };
  try {
    if (editorialIdInput.value) {
      await api("PUT", `/.netlify/functions/editorials/${editorialIdInput.value}`, payload);
    } else {
      await api("POST", "/.netlify/functions/editorials", payload);
    }
    editorialIdInput.value = "";
    editorialNameInput.value = "";
    editorialCountryInput.value = "";
    await loadEditorials();
  } catch (err) {
    alert("Error saving editorial: " + err.message);
  }
};

async function loadEditorials() {
  try {
    const editorials = await api("GET", "/.netlify/functions/editorials");
    editorialsTbody.innerHTML = "";
    editorials.forEach((e) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.country || ""}</td>
        <td class="actions"></td>
      `;
      const actionsTd = tr.querySelector(".actions");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        editorialIdInput.value = e.id;
        editorialNameInput.value = e.name;
        editorialCountryInput.value = e.country || "";
      };
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        if (!confirm("Delete this editorial?")) return;
        try {
          await api("DELETE", `/.netlify/functions/editorials/${e.id}`);
          await loadEditorials();
        } catch (err) {
          alert("Error deleting editorial: " + err.message);
        }
      };
      actionsTd.append(editBtn, delBtn);
      editorialsTbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading editorials:", err);
  }
}

// Initial load
loadAuthors();
loadEditorials();
