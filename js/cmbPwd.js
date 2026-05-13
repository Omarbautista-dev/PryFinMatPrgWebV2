document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCmbPssw");

  const anterior = document.getElementById("pssw_ant");
  const nuevo = document.getElementById("pssw_new");
  const repetir = document.getElementById("pssw_confirm");

  const btnAceptar = document.querySelector(".primary");

  let alertaActiva = false;

  // activar botón
  function validarCampos() {
    btnAceptar.disabled = !(
      anterior.value.trim() &&
      nuevo.value.trim() &&
      repetir.value.trim()
    );
  }

  [anterior, nuevo, repetir].forEach((i) =>
    i.addEventListener("input", validarCampos),
  );

  // regex
  function validarPassword(pass) {
    return /^[A-Z][a-z]{2}\d{2}[A-Za-z]{3}\d{2}[A-Za-z]{3}\d{2}[+\.\*\$@;%]$/.test(
      pass,
    );
  }

  // mostrar / ocultar password
  document.querySelectorAll(".togglePassword").forEach((toggle) => {
    const input = toggle.previousElementSibling;

    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  // ALERTA GENERAL

  function mostrarAlerta(mensaje, limpiar = false, tipo = "error") {
    if (alertaActiva) return;

    alertaActiva = true;

    const alerta = document.getElementById("alertaTop");
    const texto = document.getElementById("mensajeAlerta");
    const btn = document.getElementById("btnAceptar");

    texto.textContent = mensaje;

    // limpiar tipos anteriores
    alerta.classList.remove("error", "success");

    // agregar tipo actual
    alerta.classList.add(tipo);

    alerta.classList.add("show");

    const cerrar = () => {
      alerta.classList.remove("show");

      alertaActiva = false;

      if (limpiar) {
        limpiarFormulario();
      }
    };

    const timer = setTimeout(cerrar, 3000);

    btn.onclick = () => {
      clearTimeout(timer);

      cerrar();
    };
  }

  // ERROR INPUT
  function mostrarError(input, idError, mensaje) {
    const el = document.getElementById(idError);

    el.textContent = mensaje;

    el.classList.add("show");

    input.classList.add("input-error", "shake");

    // alerta general
    mostrarAlerta(mensaje);

    setTimeout(() => {
      el.textContent = "";

      el.classList.remove("show");

      input.classList.remove("input-error", "shake");
    }, 3000);
  }

  // errores backend
  function mostrarErrorBackend(idError, mensaje) {
    let input = null;

    if (idError === "errorAnt") {
      input = anterior;
    }

    if (idError === "errorNew") {
      input = nuevo;
    }

    if (idError === "errorConfirm") {
      input = repetir;
    }

    if (!input) {
      mostrarAlerta(mensaje);

      return;
    }

    mostrarError(input, idError, mensaje);
  }

  // limpiar errores
  function limpiarErrores() {
    ["errorAnt", "errorNew", "errorConfirm"].forEach((id) => {
      const el = document.getElementById(id);

      if (el) {
        el.textContent = "";
      }
    });
  }

  // limpiar form
  function limpiarFormulario() {
    anterior.value = "";
    nuevo.value = "";
    repetir.value = "";

    btnAceptar.disabled = true;

    limpiarErrores();

    [anterior, nuevo, repetir].forEach((input) => {
      input.classList.remove("input-error", "shake");
    });
  }

  // SUBMIT
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    limpiarErrores();

    let error = false;

    const anteriorVal = anterior.value.trim();
    const nuevoVal = nuevo.value.trim();
    const repetirVal = repetir.value.trim();

    // contraseña actual vacía
    if (!anteriorVal) {
      mostrarError(anterior, "errorAnt", "Ingrese contraseña actual");

      error = true;
    }

    // formato actual
    if (anteriorVal && !validarPassword(anteriorVal)) {
      mostrarError(anterior, "errorAnt", "Formato inválido");

      error = true;
    }

    // formato nueva
    if (!validarPassword(nuevoVal)) {
      mostrarError(nuevo, "errorNew", "Formato inválido");

      error = true;
    }

    // formato confirmar
    if (!validarPassword(repetirVal)) {
      mostrarError(repetir, "errorConfirm", "Formato inválido");

      error = true;
    }

    // igual al anterior
    if (nuevoVal === anteriorVal) {
      mostrarError(nuevo, "errorNew", "No puede ser igual al anterior");

      error = true;
    }

    // no coinciden
    if (
      validarPassword(nuevoVal) &&
      validarPassword(repetirVal) &&
      nuevoVal !== repetirVal
    ) {
      mostrarError(repetir, "errorConfirm", "Las contraseñas no coinciden");

      error = true;
    }

    if (error) return;

    try {
      const res = await fetch("php/cmbPwd.php", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          anterior: anteriorVal,
          nuevo: nuevoVal,
        }),
      });

      const data = await res.json();

      // errores backend
      if (!data.ok) {
        if (data.campo) {
          mostrarErrorBackend(data.campo, data.mensaje);
        } else {
          mostrarAlerta(data.mensaje);
        }

        return;
      }

      // éxito
      mostrarAlerta("Contraseña actualizada correctamente", true);
    } catch {
      mostrarErrorBackend("errorNew", "Error de conexión");
    }
  });
});
