document.addEventListener("DOMContentLoaded", cargarNombres);

function cargarNombres() {
  fetch("api/cNombreAPI.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en API");
      }

      return response.json();
    })

    .then((data) => {
      let select = document.getElementById("cNombre");

      // limpiar select
      select.innerHTML = "";

      // opcion por defecto
      let optionDefault = document.createElement("option");

      optionDefault.value = "";
      optionDefault.textContent = "Seleccione NOMBRE";
      optionDefault.disabled = true;
      optionDefault.selected = true;

      select.appendChild(optionDefault);

      // recorrer datos
      data.forEach((persona) => {
        let option = document.createElement("option");

        // VALUE = ID PERSONA
        option.value = persona.CvPerson;

        // TEXTO = NOMBRE COMPLETO
        option.textContent = persona.NombreCompleto;

        select.appendChild(option);
      });
    })

    .catch((error) => {
      console.error("Error:", error);

      let select = document.getElementById("cNombre");

      select.innerHTML = '<option value="">Error al cargar nombres</option>';
    });
}
