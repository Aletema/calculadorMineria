let contadorTalonarios = 4;

function mostrarInput() {
    if (contadorTalonarios < 10) {
        contadorTalonarios++;
        const inputGroup = document.querySelector(`.input-group:nth-of-type(${contadorTalonarios + 1})`);
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
        const inputGroup = document.querySelector(`.input-group:nth-of-type(${contadorTalonarios + 1})`);
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

// Initial call to update indicators on page load
document.addEventListener("DOMContentLoaded", function() {
    updateIndicators();
});
