let contadorTalonarios = 3;

function mostrarInput() {
    if (contadorTalonarios < 9) {
        contadorTalonarios++;
        const inputGroup = document.querySelector(`fieldset:nth-of-type(${contadorTalonarios + 0})`); // +3 para ajustarse a los nuevos inputs
        if (inputGroup) {
            inputGroup.classList.remove('oculto');
        }
    } else {
        Swal.fire({
            title: 'Límite alcanzado',
            text: 'No se pueden agregar más de 10 talonarios.',
            icon: 'warning',
            confirmButtonText: 'Cerrar'
        });
    }
    updateIndicators();
}

function quitarInput() {
    if (contadorTalonarios > 1) {
        const inputGroup = document.querySelector(`fieldset:nth-of-type(${contadorTalonarios + 0})`); // +3 para ajustarse a los nuevos inputs
        if (inputGroup) {
            inputGroup.classList.add('oculto');
            document.getElementById(`grade${contadorTalonarios}`).value = "0";
            document.getElementById(`from${contadorTalonarios}`).value = "";
            document.getElementById(`to${contadorTalonarios}`).value = "";
            contadorTalonarios--;
        }
    } else {
        Swal.fire({
            title: 'Límite alcanzado',
            text: 'Debe haber al menos un talonario.',
            icon: 'warning',
            confirmButtonText: 'Cerrar'
        });
    }
    updateIndicators();
}

function autoCompleteTo(index) {
    const fromInput = document.getElementById(`from${index}`);
    const toInput = document.getElementById(`to${index}`);
    const fromValue = parseInt(fromInput.value, 10);

    if (!isNaN(fromValue)) {
        toInput.value = fromValue + 49;
    } else {
        toInput.value = "";
    }
}

function updateIndicators() {
    const grade0 = parseFloat(document.getElementById('grade0').value) || 0;
    let totalM3Tn = 0;
    let valorTotal = 0;

    for (let i = 1; i <= contadorTalonarios; i++) {
        const gradeValue = parseFloat(document.getElementById(`grade${i}`).value) || 0;
        totalM3Tn += gradeValue;
        valorTotal += gradeValue * grade0;
    }

    document.getElementById('totalM3Tn').textContent = `Total M³/Tn: ${totalM3Tn}`;
    document.getElementById('valorTotal').textContent = `Valor Total: $${valorTotal.toFixed(2)}`;
}

function calcularPromedio() {
    const grade0 = parseFloat(document.getElementById('grade0').value);
    const values = [];

    for (let i = 1; i <= contadorTalonarios; i++) {
        values.push(parseFloat(document.getElementById(`grade${i}`).value));
    }

    const promedio = values.reduce((acc, val) => acc + (val * grade0), 0);

    if (promedio > 0) {
        Swal.fire({
            title: 'Monto a Pagar',
            html: `<p>El Valor Total es:</p><p style="font-size: 24px; font-weight: bold;">${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(promedio)}</p>`,
            icon: 'success',
            confirmButtonText: 'Cerrar'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Debe ingresar valores para hacer el cálculo!',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
}

function descargarTabla() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombrePM = document.getElementById('nombrePM').value.trim();
    const numeroPM = document.getElementById('numeroPM').value.trim();
    const grade0 = parseFloat(document.getElementById('grade0').value) || 0;
    let totalM3Tn = 0;
    let valorTotal = 0;
    let filas = [];
    let valid = true; // Variable para validar los inputs

    // Verificar si los campos nombrePM y numeroPM están vacíos
    if (!nombrePM || !numeroPM) {
        Swal.fire({
            title: 'Error',
            text: 'Debe ingresar el Nombre de PM y el Número de PM.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    // Verificar si el campo grade0 es válido
    if (grade0 <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'Debe ingresar un precio unitario del mineral válido.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    for (let i = 1; i <= contadorTalonarios; i++) {
        const fromValue = document.getElementById(`from${i}`).value.trim();
        const toValue = document.getElementById(`to${i}`).value.trim();
        const gradeValue = parseFloat(document.getElementById(`grade${i}`).value) || 0;

        // Verificar si los campos de talonario están vacíos o si los valores son no válidos
        if (!fromValue || !toValue || gradeValue <= 0) {
            valid = false;
            break;
        }

        const valorTalonario = gradeValue * grade0;
        totalM3Tn += gradeValue;
        valorTotal += valorTalonario;

        filas.push([`Talonario ${i}`, fromValue, toValue, gradeValue, valorTalonario.toFixed(2)]);
    }

    // Mostrar un mensaje de error si hay campos vacíos o no válidos
    if (!valid) {
        Swal.fire({
            title: 'Error',
            text: 'Debe completar todos los campos de los talonarios con valores válidos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    filas.push(["Total", "", "", totalM3Tn, valorTotal.toFixed(2)]);

    doc.text("Informe de Talonarios", 20, 20);
    doc.text(`Nombre de PM: ${nombrePM}`, 20, 30);
    doc.text(`N° de PM: ${numeroPM}`, 20, 40);
    doc.autoTable({
        head: [["Talonario", "Desde", "Hasta", "M³/Tn", "Valor"]],
        body: filas,
        startY: 50
    });

    doc.save("informe_talonarios.pdf");
}


// Initial call to update indicators on page load
document.addEventListener("DOMContentLoaded", function() {
    updateIndicators();
});
