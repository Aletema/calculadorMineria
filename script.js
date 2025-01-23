let contadorTalonarios = 3;

document.addEventListener("DOMContentLoaded", function() {
    updateIndicators();
});

function mostrarInput() {
    if (contadorTalonarios < 9) {
        contadorTalonarios++;
        const fieldset = document.querySelector(`fieldset:nth-of-type(${contadorTalonarios})`);
        if (fieldset) {
            fieldset.classList.remove('oculto');
        }
    } else {
        Swal.fire({
            title: 'Límite alcanzado',
            text: 'No se pueden agregar más de 9 talonarios.',
            icon: 'warning',
            confirmButtonText: 'Cerrar'
        });
    }
    updateIndicators();
}

function quitarInput() {
    if (contadorTalonarios > 1) {
        const fieldset = document.querySelector(`fieldset:nth-of-type(${contadorTalonarios})`);
        if (fieldset) {
            fieldset.classList.add('oculto');
            document.getElementById(`expediente${contadorTalonarios}`).value = "";
            document.getElementById(`from${contadorTalonarios}`).value = "";
            document.getElementById(`to${contadorTalonarios}`).value = "";
            document.getElementById(`grade${contadorTalonarios}`).value = "0";
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

    const totalM3TnFormatted = new Intl.NumberFormat('es-MX').format(totalM3Tn);
    const valorTotalFormatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valorTotal);

    document.getElementById('totalM3Tn').innerHTML = `<strong>Total M³/Tn: ${totalM3TnFormatted}</strong>`;
    document.getElementById('valorTotal').innerHTML = `<strong>Valor Total: ${valorTotalFormatted}</strong>`;
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
    let valid = true;

    if (!nombrePM || !numeroPM) {
        Swal.fire({
            title: 'Error',
            text: 'Debe ingresar el Nombre de PM y el Número de PM.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

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
        const expedienteValue = document.getElementById(`expediente${i}`).value.trim();

        if (!fromValue || !toValue || gradeValue <= 0 || !expedienteValue) {
            valid = false;
            break;
        }

        const valorTalonario = gradeValue * grade0;
        totalM3Tn += gradeValue;
        valorTotal += valorTalonario;

        filas.push([`Talonario ${i}`, expedienteValue, fromValue, toValue, gradeValue, valorTalonario.toFixed(2)]);
    }

    if (!valid) {
        Swal.fire({
            title: 'Error',
            text: 'Debe completar todos los campos de los talonarios con valores válidos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    filas.push(["Total", "", "", "", totalM3Tn, valorTotal.toFixed(2)]);

    doc.text("Informe de Talonarios", 20, 20);
    doc.text(`Nombre de PM: ${nombrePM}`, 20, 30);
    doc.text(`N° de PM: ${numeroPM}`, 20, 40);
    doc.autoTable({
        head: [["Talonario", "Expediente", "Desde", "Hasta", "M³/Tn", "Valor"]],
        body: filas,
        startY: 50
    });

    doc.save("informe_talonarios.pdf");
}
document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });
});
document.addEventListener("DOMContentLoaded", function() {
    updateTotal();
});

function calcularTotal() {
    const nombrePM = document.getElementById('nombrePM').value.trim();
    const numeroPM = document.getElementById('numeroPM').value.trim();
    const expedientes = [
        {
            nombre: document.getElementById('nombreExpediente1').value.trim(),
            numero: document.getElementById('numeroExpediente1').value.trim(),
            cantidad: parseInt(document.getElementById('cantidadTalonarios1').value) || 0
        },
        {
            nombre: document.getElementById('nombreExpediente2').value.trim(),
            numero: document.getElementById('numeroExpediente2').value.trim(),
            cantidad: parseInt(document.getElementById('cantidadTalonarios2').value) || 0
        },
        {
            nombre: document.getElementById('nombreExpediente3').value.trim(),
            numero: document.getElementById('numeroExpediente3').value.trim(),
            cantidad: parseInt(document.getElementById('cantidadTalonarios3').value) || 0
        }
    ];

    // Validar al menos un expediente completo antes de calcular
    if (!nombrePM || !numeroPM || expedientes.every(exp => !exp.nombre || !exp.numero || exp.cantidad <= 0)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos en al menos un expediente correctamente.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const valorTalonario = 9000; // Valor fijo del talonario
    const valorTotal = expedientes.reduce((acc, exp) => acc + (exp.nombre && exp.numero && exp.cantidad > 0 ? exp.cantidad * valorTalonario : 0), 0);
    const valorTotalFormatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valorTotal);
    
    document.getElementById('valorTotal').innerHTML = `<strong>Valor Total: ${valorTotalFormatted}</strong>`;
}

function generarPDF() {
    const nombrePM = document.getElementById('nombrePM').value.trim();
    const numeroPM = document.getElementById('numeroPM').value.trim();
    const expedientes = [
        {
            nombre: document.getElementById('nombreExpediente1').value.trim(),
            numero: document.getElementById('numeroExpediente1').value.trim(),
            cantidad: parseInt(document.getElementById('cantidadTalonarios1').value) || 0
        },
        {
            nombre: document.getElementById('nombreExpediente2').value.trim(),
            numero: document.getElementById('numeroExpediente2').value.trim(),
            cantidad: parseInt(document.getElementById('cantidadTalonarios2').value) || 0
        },
        {
            nombre: document.getElementById('nombreExpediente3').value.trim(),
            numero: document.getElementById('numeroExpediente3').value.trim(),
            cantidad: parseInt(document.getElementById('cantidadTalonarios3').value) || 0
        }
    ];

    // Validar al menos un expediente completo antes de generar el PDF
    if (!nombrePM || !numeroPM || expedientes.every(exp => !exp.nombre || !exp.numero || exp.cantidad <= 0)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos en al menos un expediente correctamente.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const valorTalonario = 9000; // Valor fijo del talonario
    const valorTotal = expedientes.reduce((acc, exp) => acc + (exp.nombre && exp.numero && exp.cantidad > 0 ? exp.cantidad * valorTalonario : 0), 0);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Informe de Compra de Talonarios", 20, 20);
    doc.text(`Nombre de PM: ${nombrePM}`, 20, 30);
    doc.text(`Número de PM: ${numeroPM}`, 20, 40);

    const tableData = expedientes
        .filter(exp => exp.nombre && exp.numero && exp.cantidad > 0)
        .map((exp, index) => [
            `Expediente ${index + 1}`, 
            exp.nombre, 
            exp.numero, 
            exp.cantidad, 
            new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(exp.cantidad * valorTalonario)
        ]);

    doc.autoTable({
        startY: 50,
        head: [['Expediente', 'Nombre', 'Número', 'Cantidad de Talonarios', 'Valor Total']],
        body: tableData
    });

    doc.text(`Valor del Talonario: $9.000`, 20, doc.autoTable.previous.finalY + 10);
    doc.text(`Valor Total: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valorTotal)}`, 20, doc.autoTable.previous.finalY + 20);

    doc.save("informe_talonarios.pdf");
}

document.addEventListener("DOMContentLoaded", function() {
    updateTotal();
});

function updateTotal() {
    // Inicializar valor total en 0
    document.getElementById('valorTotal').innerHTML = '<strong>Valor Total: $0.00</strong>';
}
