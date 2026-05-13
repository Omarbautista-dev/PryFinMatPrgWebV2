// 🔒 Verificar si hay sesión
function verificarSesion() {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    window.location.href = "Login.html";
  }
}

// 🚪 Logout
function logout() {
  fetch("api/logout.php").then(() => {
    localStorage.clear();
    window.location.href = "Login.html";
  });
}
