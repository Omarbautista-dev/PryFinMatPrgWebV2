// ===== VERIFICAR SESIÓN =====

function verificarSesion() {
  const usuario = localStorage.getItem("usuario");

  // SI NO HAY LOGIN
  if (!usuario) {
    window.location.href = "Login.html";
  }
}
// ===== REDIRECCIÓN =====

function ir(pagina) {
  window.location.href = pagina;
}

// ===== LOGOUT =====

window.logout = function () {
  localStorage.clear();

  window.location.href = "login.html";
};

// ===== DASHBOARD =====

document.addEventListener("DOMContentLoaded", () => {
  // ===== OBTENER NOMBRE =====

  const nombre = localStorage.getItem("nombre");

  // ===== OBTENER ROL =====

  const rol = localStorage.getItem("rol");

  // ===== ELEMENTOS =====

  const bienvenida = document.getElementById("bienvenida");

  const rolUsuario = document.getElementById("rolUsuario");

  // ===== MOSTRAR NOMBRE =====

  if (nombre && bienvenida) {
    bienvenida.innerText = "Bienvenido, " + nombre;
  }

  // ===== MOSTRAR ROL =====

  if (rol && rolUsuario) {
    rolUsuario.innerText = "Rol: " + rol;
  }
});
