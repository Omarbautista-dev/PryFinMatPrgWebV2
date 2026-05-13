//TOGGLE PASSWORD
const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password_input");

if (toggle && passwordInput) {
  toggle.addEventListener("click", () => {
    const tipo = passwordInput.getAttribute("type");

    if (tipo === "password") {
      passwordInput.setAttribute("type", "text");
      toggle.classList.remove("fa-eye");
      toggle.classList.add("fa-eye-slash");
    } else {
      passwordInput.setAttribute("type", "password");
      toggle.classList.remove("fa-eye-slash");
      toggle.classList.add("fa-eye");
    }
  });
}

//ALERTA GENERAL
function mostrarAlerta(mensaje) {
  const alerta = document.getElementById("alertaTop");
  const texto = document.getElementById("mensajeAlerta");
  const btn = document.getElementById("btnAceptar");

  if (!alerta || !texto || !btn) return;

  texto.textContent = mensaje;
  alerta.classList.add("show");

  //Timer para ocultar automáticamente
  const timer = setTimeout(() => {
    alerta.classList.remove("show");

    //limpiar automáticamente
    document.getElementById("usuario").value = "";
    document.getElementById("password_input").value = "";
  }, 3000);

  //Aquí se limpian los inputs
  btn.onclick = () => {
    clearTimeout(timer);
    alerta.classList.remove("show");

    document.getElementById("usuario").value = "";
    document.getElementById("password_input").value = "";
  };
}

//ERROR EN INPUT
function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = mensaje;
  el.classList.add("show");

  setTimeout(() => {
    el.textContent = "";
    el.classList.remove("show");
  }, 3000);
}

//LIMPIAR ERRORES
function limpiarErrores() {
  const eUser = document.getElementById("errorUsuario");
  const ePass = document.getElementById("errorPassword");

  if (eUser) {
    eUser.textContent = "";
    eUser.classList.remove("show");
  }

  if (ePass) {
    ePass.textContent = "";
    ePass.classList.remove("show");
  }
}

//LOGIN
document.getElementById("formLogin")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password_input").value;

  fetch("php/loginControl.php", {
    method: "POST",
    body: new URLSearchParams({
      usuario: usuario,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      limpiarErrores(); //IMPORTANTE

      if (data.success) {
        localStorage.setItem("modulos", JSON.stringify(data.modulos));
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("nombre", data.nombre);
        localStorage.setItem("rol", data.rol);

        window.location.href = "dashboard.html";
      } else {
        // 🔴 ERRORES POR CAMPO
        if (data.errores) {
          if (data.errores.usuario) {
            mostrarError("errorUsuario", data.errores.usuario);
            shakeInput("usuario");
            marcarInput("usuario");
          }

          if (data.errores.password) {
            mostrarError("errorPassword", data.errores.password);
            shakeInput("password_input");
            marcarInput("password_input");
          }
        }

        // 🔴 MENSAJE GENERAL
        if (data.mensaje) {
          mostrarAlerta(data.mensaje);
        }
      }
    })
    .catch((error) => {
      console.error(error);
      mostrarAlerta("Error al conectar con el servidor");
    });
});
function shakeInput(id) {
  const input = document.getElementById(id);

  if (!input) return;

  input.classList.add("shake");

  // quitar clase para poder repetir animación
  setTimeout(() => {
    input.classList.remove("shake");
  }, 300);
}
function marcarInput(id) {
  const input = document.getElementById(id);

  if (input) {
    input.classList.add("input-error");

    setTimeout(() => {
      input.classList.remove("input-error");
    }, 3000);
  }
}
