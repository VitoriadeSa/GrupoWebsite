const API = "http://localhost:5000/api/utilizadores";

function getUser() {
    return JSON.parse(localStorage.getItem("utilizador"));
}

// =========================
// IDENTIFICAR UTILIZADOR LOGADO 
// =========================
function isMe(user) {
    const me = getUser();
    if (!me || !user) return false;

    return (
        (me._id && user._id && me._id === user._id) ||
        (me.email && user.email && me.email === user.email)
    );
}

// =========================
// ADMIN MENU
// =========================
function verificarAdmin() {
    const user = getUser();
    if (!user) return;

    if (user.perfil !== "Administrador") {
        const menu = document.getElementById("registosU");
        if (menu) menu.style.display = "none";
    }
}

function protegerView(name) {
    const user = getUser();

    if (name === "utilizadores" && user?.perfil !== "Administrador") {
        alert("Apenas administradores");
        return false;
    }

    return true;
}

// =========================
// CRIAR
// =========================
async function criarUtilizador() {

    const nome = document.getElementById("novoNome").value;
    const email = document.getElementById("novoEmail").value;
    const password = document.getElementById("novoPassword").value;
    const perfil = document.getElementById("novoPerfil").value;

    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password, perfil })
    });

    const data = await res.json();

    alert(data.mensagem || "Criado");

    carregarUtilizadores();
}

// =========================
// LISTAR 
// =========================
async function carregarUtilizadores() {

    const tabela = document.getElementById("listaUtilizadores");
    tabela.innerHTML = "<tr><td colspan='4'>A carregar...</td></tr>";

    try {
        const res = await fetch(API);
        const users = await res.json();

        tabela.innerHTML = "";

        users.forEach(user => {

            const self = isMe(user);

            tabela.innerHTML += `
                <tr style="${self ? "background:#f1f5f9;" : ""}">

                    <td>
                        ${user.nome} ${self ? "<b>(tu)</b>" : ""}
                    </td>

                    <td>${user.email}</td>

                    <td>
                        ${
                            self
                            ? `<span style="
                                padding:4px 10px;
                                background:#e2e8f0;
                                border-radius:12px;
                                font-size:12px;
                            ">${user.perfil}</span>`
                            : `
                                <select onchange="atualizarPerfil('${user._id}', this.value)">
                                    <option ${user.perfil === "Técnico" ? "selected" : ""}>Técnico</option>
                                    <option ${user.perfil === "Especialista" ? "selected" : ""}>Especialista</option>
                                    <option ${user.perfil === "Administrador" ? "selected" : ""}>Administrador</option>
                                </select>
                            `
                        }
                    </td>

                    <td>
                        ${
                            self
                            ? `<span style="color:#64748b;font-size:12px;">Utilizador Atual</span>`
                            : `
                                <button onclick="eliminarUtilizador('${user._id}')"
                                    style="
                                        background:#dc2626;
                                        color:white;
                                        border:none;
                                        padding:6px 10px;
                                        border-radius:6px;
                                        cursor:pointer;
                                    ">
                                    🗑 Eliminar
                                </button>
                            `
                        }
                    </td>

                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        tabela.innerHTML = "<tr><td colspan='4'>Erro</td></tr>";
    }
}

// =========================
// UPDATE PERFIL
// =========================
async function atualizarPerfil(id, perfil) {

    const me = getUser();

    if (me && (me._id === id || me.email === id)) return;

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfil })
    });

    carregarUtilizadores();
}

// =========================
// DELETE
// =========================
async function eliminarUtilizador(id) {

    const me = getUser();

    if (me && me._id === id) return;

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    carregarUtilizadores();
}

// =========================
// RELOAD
// =========================
function recarregarUtilizadores() {
    carregarUtilizadores();
}