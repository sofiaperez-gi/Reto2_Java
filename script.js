const MAX_ALUMNOS = 10;
const nombres = new Array(MAX_ALUMNOS);
const notas = Array.from({ length: MAX_ALUMNOS }, () => new Array(3));

let contadorAlumnos = 0;

const form = document.getElementById('alumnoForm');
const inputNombre = document.getElementById('nombre');
const inputC1 = document.getElementById('certamen1');
const inputC2 = document.getElementById('certamen2');
const inputC3 = document.getElementById('certamen3');
const btnAgregar = document.getElementById('btnAgregar');
const spanContador = document.getElementById('contador');
const divMensaje = document.getElementById('mensaje');
const seccionResultados = document.getElementById('seccionResultados');
const reporteTexto = document.getElementById('reporteTexto');
const tablaRankingBody = document.getElementById('tablaRankingBody');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = inputNombre.value.trim();
  const c1 = parseFloat(inputC1.value);
  const c2 = parseFloat(inputC2.value);
  const c3 = parseFloat(inputC3.value);

  if (!validarNotas(c1, c2, c3)) {
    mostrarMensaje('Por favor, ingrese notas válidas entre 0 y 100.', 'error');
    return;
  }

  if (contadorAlumnos < MAX_ALUMNOS) {
    nombres[contadorAlumnos] = nombre;
    notas[contadorAlumnos][0] = c1;
    notas[contadorAlumnos][1] = c2;
    notas[contadorAlumnos][2] = c3;

    contadorAlumnos++;
    spanContador.textContent = contadorAlumnos;
    
    mostrarMensaje(`Alumno "${nombre}" ingresado con éxito.`, 'exito');
    form.reset();
    inputNombre.focus();

    procesarYMostrarResultados();

    if (contadorAlumnos === MAX_ALUMNOS) {
      btnAgregar.disabled = true;
      btnAgregar.textContent = 'Límite de Alumnos Alcanzado';
    }
  }
});

function validarNotas(...notasArr) {
  return notasArr.every(nota => !isNaN(nota) && nota >= 0 && nota <= 100);
}

function mostrarMensaje(msg, tipo) {
  divMensaje.textContent = msg;
  divMensaje.className = `mensaje ${tipo}`;
  divMensaje.classList.remove('hidden');
}

function calcularPromedioAlumno(notasAlumno) {
  const suma = notasAlumno.reduce((acc, nota) => acc + nota, 0);
  return suma / notasAlumno.length;
}

function calcularPromedioCertamen(matrizNotas, indiceCertamen, totalAlumnos) {
  const notasCertamen = matrizNotas.slice(0, totalAlumnos).map(fila => fila[indiceCertamen]);
  const suma = notasCertamen.reduce((acc, nota) => acc + nota, 0);
  return suma / totalAlumnos;
}

function procesarYMostrarResultados() {
  if (contadorAlumnos === 0) return;

  seccionResultados.classList.remove('hidden');

  const alumnosData = nombres.slice(0, contadorAlumnos).map((nombre, index) => {
    const notasAlumno = notas[index];
    const promedio = calcularPromedioAlumno(notasAlumno);
    return {
      nombre,
      c1: notasAlumno[0],
      c2: notasAlumno[1],
      c3: notasAlumno[2],
      promedio: promedio,
      aprobado: promedio >= 55
    };
  });

  const promC1 = calcularPromedioCertamen(notas, 0, contadorAlumnos);
  const promC2 = calcularPromedioCertamen(notas, 1, contadorAlumnos);
  const promC3 = calcularPromedioCertamen(notas, 2, contadorAlumnos);

  const promGeneral = (promC1 + promC2 + promC3) / 3;

  const aprobadosCount = alumnosData.filter(a => a.aprobado).length;
  const reprobadosCount = alumnosData.length - aprobadosCount;

  let textoHTML = '';
  alumnosData.forEach((a, i) => {
    textoHTML += `Nombre ${i + 1}: ${a.nombre}\n`;
    textoHTML += `C1: ${a.c1}\n`;
    textoHTML += `C2: ${a.c2}\n`;
    textoHTML += `C3: ${a.c3}\n`;
    textoHTML += `Promedio: ${a.promedio.toFixed(2)}\n\n`;
  });

  textoHTML += `Promedio del curso C1: ${promC1.toFixed(2)}\n`;
  textoHTML += `Promedio del curso C2: ${promC2.toFixed(2)}\n`;
  textoHTML += `Promedio del curso C3: ${promC3.toFixed(2)}\n`;
  textoHTML += `Promedio Final Curso: ${promGeneral.toFixed(2)}\n`;
  textoHTML += `Aprobados: ${aprobadosCount}\n`;
  textoHTML += `Reprobados: ${reprobadosCount}`;

  reporteTexto.textContent = textoHTML;

  const alumnosOrdenados = [...alumnosData].sort((a, b) => b.promedio - a.promedio);

  tablaRankingBody.innerHTML = '';
  alumnosOrdenados.forEach((a, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${index + 1}º</td>
      <td><strong>${a.nombre}</strong></td>
      <td>${a.promedio.toFixed(2)}</td>
      <td class="${a.aprobado ? 'aprobado' : 'reprobado'}">${a.aprobado ? 'Aprobado' : 'Reprobado'}</td>
    `;
    tablaRankingBody.appendChild(fila);
  });
}