function calcularPromedio() {
    const grade0 = parseInt(document.getElementById('grade0').value);
    const grade1 = parseInt(document.getElementById('grade1').value);
    const grade2 = parseInt(document.getElementById('grade2').value);
    const grade3 = parseInt(document.getElementById('grade3').value);
  
    const promedio = ((grade1 * grade0) + (grade2 * grade0) + (grade3 * grade0));

    
  
    document.getElementById('resultado').innerText = `El Valor total es $: ${promedio.toFixed(2)}`;
  }
  