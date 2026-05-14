document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ELEMENTOS
  // =========================
  const login = document.getElementById("login");
  const password = document.getElementById("password");
  const fecini = document.getElementById("fecini");
  const fecfin = document.getElementById("fecfin");
  const cvperson = document.getElementById("cNombre");
  const edocta = document.getElementById("edocta");

  let usuarioSeleccionado = null;
  let alertaActiva = false;

  // =========================
  // BOTONES
  // =========================
  const btnNuevo = document.getElementById("btnNuevo");
  const btnGuardar = document.getElementById("btnGuardar");
  const btnModificar = document.getElementById("btnModificar");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnCancelar = document.getElementById("btnCancelar");

  // =========================
  // REGEX
  // =========================
  const regexLogin = /^[A-Z][a-z]{2}\d{2}[A-Za-z]{3}\d{2}[+\.\*$@;%]$/;

  const regexPassword =
    /^[A-Z][a-z]{2}\d{2}[A-Za-z]{3}\d{2}[A-Za-z]{3}\d{2}[+\.\*$@;%]$/;

  // =========================
  // INICIO
  // =========================
  cargarUsuarios();
  cargarPersonas();

  btnGuardar.disabled = true;

  // =========================
  // FECHAS AUTOMATICAS
  // =========================
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split("T")[0];

  fecini.value = fechaHoy;
  fecini.min = fechaHoy;

  const fechaFinAuto = new Date(hoy);
  fechaFinAuto.setMonth(fechaFinAuto.getMonth() + 1);

  if (fechaFinAuto.getDate() !== hoy.getDate()) {
    fechaFinAuto.setDate(0);
  }

  const fechaFinFormateada = fechaFinAuto.toISOString().split("T")[0];

  fecfin.value = fechaFinFormateada;
  fecfin.min = fechaHoy;

  fecini.addEventListener("change", () => {
    fecfin.min = fecini.value;

    const nuevaFecha = new Date(fecini.value);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);

    if (nuevaFecha.getDate() !== new Date(fecini.value).getDate()) {
      nuevaFecha.setDate(0);
    }

    fecfin.value = nuevaFecha.toISOString().split("T")[0];
  });

  // =========================
  // EVENTOS
  // =========================
  btnGuardar.addEventListener("click", guardarUsuario);
  btnModificar.addEventListener("click", modificarUsuario);
  btnEliminar.addEventListener("click", eliminarUsuario);

  btnNuevo.addEventListener("click", () => {
    limpiarFormulario();

    usuarioSeleccionado = null;

    cvperson.selectedIndex = 0;
    cvperson.value = "";

    fecini.value = fechaHoy;
    fecfin.value = fechaFinFormateada;

    fecini.min = fechaHoy;
    fecfin.min = fechaHoy;

    edocta.checked = true;

    btnGuardar.disabled = false;
    btnModificar.disabled = true;
    btnEliminar.disabled = true;

    btnModificar.classList.add("btn-disabled");
    btnEliminar.classList.add("btn-disabled");
    btnGuardar.classList.remove("btn-disabled");

    if (cvperson) cvperson.focus();
  });

  btnCancelar.addEventListener("click", () => {
    limpiarFormulario();

    usuarioSeleccionado = null;

    fecini.value = fechaHoy;
    fecfin.value = fechaFinFormateada;

    btnGuardar.disabled = true;
    btnModificar.disabled = false;
    btnEliminar.disabled = false;

    btnGuardar.classList.add("btn-disabled");
    btnModificar.classList.remove("btn-disabled");
    btnEliminar.classList.remove("btn-disabled");
  });

  // =========================
  // MOSTRAR / OCULTAR PASSWORD
  // =========================
  document.querySelectorAll(".togglePassword").forEach((toggle) => {
    const input = toggle.previousElementSibling;

    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  // =========================
  // ALERTA GENERAL
  // =========================
  function mostrarAlerta(mensaje, tipo = "error") {
    if (alertaActiva) return;

    alertaActiva = true;

    const alerta = document.getElementById("alertaTop");
    const texto = document.getElementById("mensajeAlerta");
    const btn = document.getElementById("btnAceptar");

    if (!alerta || !texto || !btn) {
      console.warn("Falta alertaTop, mensajeAlerta o btnAceptar en el HTML");
      return;
    }

    texto.textContent = mensaje;

    alerta.classList.remove("error", "success");
    alerta.classList.add(tipo, "show");

    const cerrar = () => {
      alerta.classList.remove("show");
      alertaActiva = false;
    };

    const timer = setTimeout(cerrar, 3000);

    btn.onclick = () => {
      clearTimeout(timer);
      cerrar();
    };
  }

  // =========================
  // ERROR DE INPUT
  // =========================
  function mostrarError(input, idError, mensaje) {
    const el = document.getElementById(idError);

    if (el) {
      el.textContent = mensaje;
      el.classList.add("show");
    }

    if (input) {
      input.classList.add("input-error", "shake");
    }

    mostrarAlerta(mensaje, "error");

    setTimeout(() => {
      if (el) {
        el.textContent = "";
        el.classList.remove("show");
      }

      if (input) {
        input.classList.remove("input-error", "shake");
      }
    }, 3000);
  }

  // =========================
  // LIMPIAR ERRORES
  // =========================
  function limpiarErrores() {
    [
      "errorPersona",
      "errorLogin",
      "errorPassword",
      "errorFecIni",
      "errorFecFin",
    ].forEach((id) => {
      const el = document.getElementById(id);

      if (el) {
        el.textContent = "";
        el.classList.remove("show");
      }
    });

    [cvperson, login, password, fecini, fecfin].forEach((input) => {
      if (input) {
        input.classList.remove("input-error", "shake");
      }
    });
  }

  // =========================
  // VALIDAR FORMULARIO
  // =========================
  function validarFormulario() {
    limpiarErrores();

    if (cvperson.value === "") {
      mostrarError(cvperson, "errorPersona", "Seleccione una persona");
      return false;
    }

    if (!regexLogin.test(login.value.trim())) {
      mostrarError(login, "errorLogin", "Login inválido");
      return false;
    }

    if (!regexPassword.test(password.value.trim())) {
      mostrarError(password, "errorPassword", "Password inválido");
      return false;
    }

    const hoyValidacion = new Date();
    hoyValidacion.setHours(0, 0, 0, 0);

    const fechaIni = new Date(fecini.value);
    const fechaFin = new Date(fecfin.value);

    if (fechaIni < hoyValidacion) {
      mostrarError(fecini, "errorFecIni", "Fecha inicio inválida");
      return false;
    }

    if (fechaFin < fechaIni) {
      mostrarError(fecfin, "errorFecFin", "Fecha fin inválida");
      return false;
    }

    return true;
  }

  // =========================
  // GUARDAR
  // =========================
  async function guardarUsuario() {
    if (!validarFormulario()) return;

    btnGuardar.disabled = true;

    const datos = {
      accion: "guardar",
      cvperson: cvperson.value,
      login: login.value.trim(),
      password: password.value.trim(),
      fecini: fecini.value,
      fecfin: fecfin.value,
      edocta: edocta.checked ? 1 : 0,
    };

    try {
      const res = await fetch("api/usuarios_api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (!data.ok) {
        mostrarAlerta(data.mensaje, "error");
        btnGuardar.disabled = false;
        return;
      }

      mostrarAlerta("Usuario guardado correctamente", "success");

      limpiarFormulario();

      usuarioSeleccionado = null;

      fecini.value = fechaHoy;
      fecfin.value = fechaFinFormateada;
      edocta.checked = true;

      btnGuardar.disabled = true;
      btnModificar.disabled = false;
      btnEliminar.disabled = false;

      btnGuardar.classList.add("btn-disabled");
      btnModificar.classList.remove("btn-disabled");
      btnEliminar.classList.remove("btn-disabled");

      cargarUsuarios();
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al conectar con el servidor", "error");
      btnGuardar.disabled = false;
    }
  }

  // =========================
  // MODIFICAR
  // =========================
  async function modificarUsuario() {
    if (!usuarioSeleccionado) {
      mostrarAlerta("Seleccione un usuario de la tabla", "error");
      return;
    }

    if (!validarFormulario()) return;

    const datos = {
      accion: "modificar",
      cvusuario: usuarioSeleccionado,
      cvperson: cvperson.value,
      login: login.value.trim(),
      password: password.value.trim(),
      fecini: fecini.value,
      fecfin: fecfin.value,
      edocta: edocta.checked ? 1 : 0,
    };

    try {
      const res = await fetch("api/usuarios_api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (!data.ok) {
        mostrarAlerta(data.mensaje, "error");
        return;
      }

      mostrarAlerta("Usuario modificado correctamente", "success");

      limpiarFormulario();

      usuarioSeleccionado = null;

      fecini.value = fechaHoy;
      fecfin.value = fechaFinFormateada;

      btnGuardar.disabled = true;
      btnModificar.disabled = false;
      btnEliminar.disabled = false;

      btnGuardar.classList.add("btn-disabled");
      btnModificar.classList.remove("btn-disabled");
      btnEliminar.classList.remove("btn-disabled");

      cargarUsuarios();
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al conectar con el servidor", "error");
    }
  }

  // =========================
  // ELIMINAR
  // =========================
  async function eliminarUsuario() {
    if (!usuarioSeleccionado) {
      mostrarAlerta("Seleccione un usuario de la tabla", "error");
      return;
    }

    const confirmar = confirm(
      `¿Realmente desea eliminar este usuario?\n\nLogin: ${login.value}`,
    );

    if (!confirmar) return;

    try {
      const res = await fetch("api/usuarios_api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "eliminar",
          cvusuario: usuarioSeleccionado,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        mostrarAlerta(data.mensaje, "error");
        return;
      }

      mostrarAlerta("Usuario eliminado correctamente", "success");

      limpiarFormulario();

      usuarioSeleccionado = null;

      fecini.value = fechaHoy;
      fecfin.value = fechaFinFormateada;

      btnGuardar.disabled = true;
      btnModificar.disabled = false;
      btnEliminar.disabled = false;

      btnGuardar.classList.add("btn-disabled");
      btnModificar.classList.remove("btn-disabled");
      btnEliminar.classList.remove("btn-disabled");

      cargarUsuarios();
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al conectar con el servidor", "error");
    }
  }

  // =========================
  // CARGAR USUARIOS
  // =========================
  async function cargarUsuarios() {
    try {
      const res = await fetch("api/usuarios_api.php?accion=listar");

      const data = await res.json();

      const tbody = document.querySelector("#tblUsuarios tbody");

      if (!tbody) return;

      tbody.innerHTML = "";

      data.forEach((u) => {
        tbody.innerHTML += `
          <tr class="fila-usuario"
              data-cvusuario="${u.CvUsuario}"
              data-cvperson="${u.CvPerson}"
              data-login="${u.Login}"
              data-fecini="${u.FecIni}"
              data-fecfin="${u.FecFin}"
              data-edocta="${u.EdoCta}">

              <td>${u.Persona}</td>
              <td>${u.TipoPersona ?? ""}</td>
              <td>${u.Puesto ?? ""}</td>
              <td>${u.Login}</td>
              <td>${u.FecIni}</td>
              <td>${u.FecFin}</td>
              <td>${u.Estado ?? ""}</td>
          </tr>
        `;
      });

      document.querySelectorAll(".fila-usuario").forEach((fila) => {
        fila.addEventListener("click", () => {
          seleccionarFila(fila);
        });
      });
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al cargar usuarios", "error");
    }
  }

  // =========================
  // SELECCIONAR FILA
  // =========================
  function seleccionarFila(fila) {
    limpiarErrores();

    document.querySelectorAll(".fila-usuario").forEach((f) => {
      f.classList.remove("fila-seleccionada");
    });

    fila.classList.add("fila-seleccionada");

    usuarioSeleccionado = fila.dataset.cvusuario;

    cvperson.value = fila.dataset.cvperson;
    login.value = fila.dataset.login;
    password.value = "";
    fecini.value = fila.dataset.fecini;
    fecfin.value = fila.dataset.fecfin;

    const estado = String(fila.dataset.edocta).trim().toLowerCase();

    edocta.checked =
      estado === "1" ||
      estado === "true" ||
      estado === "activo" ||
      estado === "activa" ||
      estado === "activado";

    btnGuardar.disabled = true;
    btnModificar.disabled = false;
    btnEliminar.disabled = false;

    btnGuardar.classList.add("btn-disabled");
    btnModificar.classList.remove("btn-disabled");
    btnEliminar.classList.remove("btn-disabled");
  }

  // =========================
  // CARGAR PERSONAS
  // =========================
  async function cargarPersonas() {
    try {
      const res = await fetch("api/usuarios_api.php?accion=personas");

      const data = await res.json();

      if (!cvperson) return;

      cvperson.innerHTML = `<option value="">Seleccione NOMBRE</option>`;

      data.forEach((p) => {
        cvperson.innerHTML += `
          <option value="${p.CvPerson}">
              ${p.NombreCompleto}
          </option>
        `;
      });
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al cargar nombres", "error");
    }
  }

  // =========================
  // LIMPIAR FORMULARIO
  // =========================
  function limpiarFormulario() {
    limpiarErrores();

    login.value = "";
    password.value = "";
    fecini.value = "";
    fecfin.value = "";

    cvperson.selectedIndex = 0;
    cvperson.value = "";

    edocta.checked = true;
  }
});
