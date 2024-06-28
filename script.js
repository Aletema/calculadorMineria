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
}

function quitarInput() {
    if (contadorTalonarios > 1) {
        const inputGroup = document.querySelector(`.input-group:nth-of-type(${contadorTalonarios + 1})`);
        if (inputGroup) {
            inputGroup.classList.add('oculto');
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
            text: `El Valor Total es: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(promedio)}`,
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
